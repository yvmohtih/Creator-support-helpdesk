import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  getRequestCategoryName,
  maskMobileNumber,
  ProblemDetailsData,
  validateProblemDetails,
} from '@creator-support/shared';
import {
  AttachmentUploadedBy,
  Platform,
  PreferredLanguage,
  Prisma,
  RequestPriority,
  RequestStatus,
} from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../database/prisma.service';
import { CreatePublicSupportRequestDto } from '../dto/create-public-support-request.dto';
import { RequestNumberService } from './request-number.service';
import {
  ScreenshotUploadService,
  StoredScreenshot,
  UploadedScreenshotFile,
} from './screenshot-upload.service';

export interface SubmissionResult {
  attachmentCount: number;
  requestNumber: string;
  platform: Platform;
  categoryName: string;
  maskedMobile: string;
  submittedAt: string;
}

const maxRequestNumberAttempts = 5;

@Injectable()
export class PublicSupportRequestService {
  private readonly completedSubmissions = new Map<string, SubmissionResult>();
  private readonly inFlightSubmissions = new Map<string, Promise<SubmissionResult>>();

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RequestNumberService) private readonly requestNumbers: RequestNumberService,
    @Inject(ScreenshotUploadService)
    private readonly screenshotUploads: ScreenshotUploadService,
  ) {}

  async submit(input: CreatePublicSupportRequestDto, screenshots: UploadedScreenshotFile[] = []) {
    const existing = this.completedSubmissions.get(input.idempotencyKey);

    if (existing) {
      return existing;
    }

    const inFlight = this.inFlightSubmissions.get(input.idempotencyKey);

    if (inFlight) {
      return inFlight;
    }

    const submission = this.createSubmission(input, screenshots);
    this.inFlightSubmissions.set(input.idempotencyKey, submission);

    try {
      const result = await submission;
      this.completedSubmissions.set(input.idempotencyKey, result);
      return result;
    } finally {
      this.inFlightSubmissions.delete(input.idempotencyKey);
    }
  }

  private async createSubmission(
    input: CreatePublicSupportRequestDto,
    screenshots: UploadedScreenshotFile[],
  ): Promise<SubmissionResult> {
    const categoryName = getRequestCategoryName(input.platform, input.category);

    if (!categoryName) {
      throw new BadRequestException('This problem category is no longer available.');
    }

    const validation = validateProblemDetails({
      name: input.name,
      platformHandle: input.platformHandle,
      mobile: input.mobile,
      email: input.email ?? '',
      description: input.description,
      preferredLanguage: input.preferredLanguage,
      consent: input.consent,
      platform: input.platform,
    });

    if (!validation.isValid || !validation.data) {
      throw new BadRequestException('We could not submit your request. Please check the details.');
    }

    const category = await this.prisma.issueCategory.findUnique({
      where: {
        platform_nameEn: {
          platform: input.platform as Platform,
          nameEn: categoryName,
        },
      },
    });

    if (!category || !category.isActive || category.platform !== input.platform) {
      throw new BadRequestException('This problem category is no longer available.');
    }

    const supportRequestId = randomUUID();
    const storedScreenshots = await this.screenshotUploads.validateAndStore(
      screenshots,
      supportRequestId,
    );

    const created = await this.createWithRequestNumberRetry({
      categoryId: category.id,
      categoryName,
      data: validation.data,
      storedScreenshots,
      supportRequestId,
    });

    return {
      attachmentCount: storedScreenshots.length,
      requestNumber: created.requestNumber,
      platform: created.platform,
      categoryName,
      maskedMobile: maskMobileNumber(validation.data.mobile),
      submittedAt: created.createdAt.toISOString(),
    };
  }

  private async createWithRequestNumberRetry(input: {
    categoryId: string;
    categoryName: string;
    data: ProblemDetailsData;
    storedScreenshots: StoredScreenshot[];
    supportRequestId: string;
  }) {
    for (let attempt = 0; attempt < maxRequestNumberAttempts; attempt += 1) {
      const requestNumber = this.requestNumbers.generate();

      try {
        return await this.prisma.$transaction(async (transaction) => {
          const supportRequest = await transaction.supportRequest.create({
            data: {
              id: input.supportRequestId,
              requestNumber,
              platform: input.data.platform as Platform,
              categoryId: input.categoryId,
              userName: input.data.name,
              platformUsername: input.data.platformHandle || null,
              mobileNumber: input.data.mobile,
              email: input.data.email ? input.data.email.toLowerCase() : null,
              description: input.data.description,
              preferredLanguage: input.data.preferredLanguage as PreferredLanguage,
              status: RequestStatus.received,
              priority: RequestPriority.normal,
              assignedAdminId: null,
              resolvedAt: null,
            },
          });

          await transaction.requestStatusHistory.create({
            data: {
              supportRequestId: supportRequest.id,
              oldStatus: null,
              newStatus: RequestStatus.received,
              changedByAdminId: null,
              note: 'Request created by public user.',
            },
          });

          if (input.storedScreenshots.length > 0) {
            await transaction.requestAttachment.createMany({
              data: input.storedScreenshots.map((file) => ({
                fileSize: file.fileSize,
                mimeType: file.mimeType,
                originalFileName: file.originalFileName,
                requestMessageId: null,
                storagePath: file.storagePath,
                supportRequestId: supportRequest.id,
                uploadedBy: AttachmentUploadedBy.user,
              })),
            });
          }

          return supportRequest;
        });
      } catch (error) {
        if (this.isUniqueRequestNumberError(error) && attempt < maxRequestNumberAttempts - 1) {
          continue;
        }

        if (this.isUniqueRequestNumberError(error)) {
          await this.screenshotUploads.cleanup(input.storedScreenshots);
          throw new ConflictException('We could not submit your request. Please try again.');
        }

        await this.screenshotUploads.cleanup(input.storedScreenshots);
        throw new InternalServerErrorException(
          'We could not submit your request. Please try again.',
        );
      }
    }

    throw new ConflictException('We could not submit your request. Please try again.');
  }

  private isUniqueRequestNumberError(error: unknown) {
    const knownError =
      error instanceof Prisma.PrismaClientKnownRequestError ||
      (typeof error === 'object' && error !== null && 'code' in error);

    return (
      knownError &&
      'code' in error &&
      error.code === 'P2002' &&
      'meta' in error &&
      typeof error.meta === 'object' &&
      error.meta !== null &&
      'target' in error.meta &&
      Array.isArray(error.meta?.target) &&
      error.meta.target.includes('request_number')
    );
  }
}
