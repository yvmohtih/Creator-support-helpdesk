import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { memoryStorage } from 'multer';
import { CreatePublicSupportRequestDto } from '../dto/create-public-support-request.dto';
import { PublicSubmitRateLimitService } from '../services/public-submit-rate-limit.service';
import { PublicSupportRequestService } from '../services/public-support-request.service';
import { UploadedScreenshotFile } from '../services/screenshot-upload.service';

@Controller('public/support-requests')
export class PublicSupportRequestController {
  constructor(
    @Inject(PublicSupportRequestService)
    private readonly supportRequests: PublicSupportRequestService,
    @Inject(PublicSubmitRateLimitService)
    private readonly rateLimit: PublicSubmitRateLimitService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('screenshots', 10, {
      storage: memoryStorage(),
    }),
  )
  async create(
    @Body() body: CreatePublicSupportRequestDto,
    @UploadedFiles() files: UploadedScreenshotFile[] | undefined,
    @Req() request: Request,
  ) {
    this.rateLimit.assertAllowed(`${request.ip ?? 'unknown'}:${body.idempotencyKey}`);
    const result = await this.supportRequests.submit(body, files ?? []);

    return {
      success: true,
      data: result,
    };
  }
}
