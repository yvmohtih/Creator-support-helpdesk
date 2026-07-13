import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Platform, PreferredLanguage, RequestPriority, RequestStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { CreatePublicSupportRequestDto } from './modules/public-support/dto/create-public-support-request.dto';
import { PublicSupportRequestService } from './modules/public-support/services/public-support-request.service';
import { RequestNumberService } from './modules/public-support/services/request-number.service';
import {
  ScreenshotUploadService,
  StoredScreenshot,
  UploadedScreenshotFile,
} from './modules/public-support/services/screenshot-upload.service';

const baseInput: CreatePublicSupportRequestDto = {
  category: 'account-disabled',
  consent: true,
  description: 'My Instagram account was disabled yesterday and I saw an appeal message.',
  email: 'creator@example.com',
  idempotencyKey: 'request-key-1',
  mobile: '+91 98765 43210',
  name: 'Mohith Kumar',
  platform: 'instagram',
  platformHandle: 'creator_page',
  preferredLanguage: 'en',
};

function createService(options?: {
  category?: { id: string; isActive: boolean; platform: Platform } | null;
  requestNumbers?: string[];
  statusHistoryError?: Error;
  storedScreenshots?: StoredScreenshot[];
  transactionErrors?: unknown[];
  uploadError?: Error;
}) {
  const category = options?.category ?? {
    id: 'category-1',
    isActive: true,
    platform: Platform.instagram,
  };
  const generatedNumbers = options?.requestNumbers ?? ['RB-2026-ABCDEF'];

  const supportRequestCreate = vi.fn(async ({ data }) => ({
    ...data,
    createdAt: new Date('2026-07-13T07:00:00.000Z'),
    id: 'support-request-1',
    updatedAt: new Date('2026-07-13T07:00:00.000Z'),
  }));
  const statusHistoryCreate = vi.fn(async ({ data }) => {
    if (options?.statusHistoryError) {
      throw options.statusHistoryError;
    }

    return { ...data, id: 'history-1' };
  });
  const requestAttachmentCreateMany = vi.fn(async ({ data }) => ({ count: data.length }));
  const issueCategoryFindUnique = vi.fn(async () => category);
  const transactionErrors = [...(options?.transactionErrors ?? [])];
  const transaction = vi.fn(async (callback) => {
    const nextError = transactionErrors.shift();

    if (nextError) {
      throw nextError;
    }

    return callback({
      requestAttachment: { createMany: requestAttachmentCreateMany },
      requestStatusHistory: { create: statusHistoryCreate },
      supportRequest: { create: supportRequestCreate },
    });
  });
  const requestNumberService = {
    generate: vi.fn(() => generatedNumbers.shift() ?? 'RB-2026-HJKLMN'),
  } as unknown as RequestNumberService;
  const screenshotUploadService = {
    cleanup: vi.fn(async () => undefined),
    validateAndStore: vi.fn(async () => {
      if (options?.uploadError) {
        throw options.uploadError;
      }

      return options?.storedScreenshots ?? [];
    }),
  } as unknown as ScreenshotUploadService;
  const service = new PublicSupportRequestService(
    {
      $transaction: transaction,
      issueCategory: { findUnique: issueCategoryFindUnique },
    } as never,
    requestNumberService,
    screenshotUploadService,
  );

  return {
    issueCategoryFindUnique,
    requestAttachmentCreateMany,
    requestNumberService,
    screenshotUploadService,
    service,
    statusHistoryCreate,
    supportRequestCreate,
    transaction,
  };
}

const pngScreenshot: UploadedScreenshotFile = {
  buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  mimetype: 'image/png',
  originalname: 'screen.png',
  size: 8,
};

describe('public support requests', () => {
  it('saves a valid request and returns safe confirmation data', async () => {
    const { service, statusHistoryCreate, supportRequestCreate } = createService({
      requestNumbers: ['RB-2026-ABCDEF'],
    });

    const result = await service.submit(baseInput);

    expect(result).toEqual({
      attachmentCount: 0,
      categoryName: 'Account disabled',
      maskedMobile: '••••••3210',
      platform: Platform.instagram,
      requestNumber: 'RB-2026-ABCDEF',
      submittedAt: '2026-07-13T07:00:00.000Z',
    });
    expect(supportRequestCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        categoryId: 'category-1',
        email: 'creator@example.com',
        mobileNumber: '9876543210',
        platform: Platform.instagram,
        preferredLanguage: PreferredLanguage.en,
        priority: RequestPriority.normal,
        requestNumber: 'RB-2026-ABCDEF',
        status: RequestStatus.received,
      }),
    });
    expect(statusHistoryCreate).toHaveBeenCalledWith({
      data: {
        changedByAdminId: null,
        newStatus: RequestStatus.received,
        note: 'Request created by public user.',
        oldStatus: null,
        supportRequestId: 'support-request-1',
      },
    });
  });

  it('submits without files and does not create attachment rows', async () => {
    const { requestAttachmentCreateMany, screenshotUploadService, service } = createService();

    const result = await service.submit(baseInput);

    expect(result.attachmentCount).toBe(0);
    expect(screenshotUploadService.validateAndStore).toHaveBeenCalledWith(
      [],
      expect.stringMatching(/^[0-9a-f-]{36}$/),
    );
    expect(requestAttachmentCreateMany).not.toHaveBeenCalled();
  });

  it('stores attachment metadata for one valid screenshot', async () => {
    const storedScreenshot = {
      fileSize: 8,
      mimeType: 'image/png',
      originalFileName: 'సమస్య.png',
      storagePath: 'support-requests/00000000-0000-0000-0000-000000000001/generated-file-id.png',
    };
    const { requestAttachmentCreateMany, service } = createService({
      storedScreenshots: [storedScreenshot],
    });

    const result = await service.submit(baseInput, [pngScreenshot]);

    expect(result.attachmentCount).toBe(1);
    expect(requestAttachmentCreateMany).toHaveBeenCalledWith({
      data: [
        {
          fileSize: 8,
          mimeType: 'image/png',
          originalFileName: 'సమస్య.png',
          requestMessageId: null,
          storagePath:
            'support-requests/00000000-0000-0000-0000-000000000001/generated-file-id.png',
          supportRequestId: 'support-request-1',
          uploadedBy: 'user',
        },
      ],
    });
  });

  it('stores metadata for three valid screenshots', async () => {
    const storedScreenshots = [1, 2, 3].map((index) => ({
      fileSize: 8,
      mimeType: 'image/png',
      originalFileName: `screen-${index}.png`,
      storagePath: `support-requests/request-id/file-${index}.png`,
    }));
    const { requestAttachmentCreateMany, service } = createService({ storedScreenshots });

    const result = await service.submit(baseInput, [pngScreenshot, pngScreenshot, pngScreenshot]);

    expect(result.attachmentCount).toBe(3);
    expect(requestAttachmentCreateMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ storagePath: 'support-requests/request-id/file-1.png' }),
        expect.objectContaining({ storagePath: 'support-requests/request-id/file-2.png' }),
        expect.objectContaining({ storagePath: 'support-requests/request-id/file-3.png' }),
      ]),
    });
  });

  it('does not store an empty optional email', async () => {
    const { service, supportRequestCreate } = createService();

    await service.submit({ ...baseInput, email: '' });

    expect(supportRequestCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ email: null }),
    });
  });

  it('preserves Telugu descriptions and preferred language', async () => {
    const { service, supportRequestCreate } = createService();
    const description = 'నా Instagram ఖాతా నిన్నటి నుంచి పనిచేయడం లేదు. దయచేసి సహాయం చేయండి.';

    await service.submit({
      ...baseInput,
      description,
      preferredLanguage: 'te',
    });

    expect(supportRequestCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        description,
        preferredLanguage: PreferredLanguage.te,
      }),
    });
  });

  it('rejects invalid categories before writing', async () => {
    const { service, supportRequestCreate } = createService();

    await expect(service.submit({ ...baseInput, category: 'missing-category' })).rejects.toThrow(
      BadRequestException,
    );
    expect(supportRequestCreate).not.toHaveBeenCalled();
  });

  it('rejects inactive categories before writing', async () => {
    const { service, supportRequestCreate } = createService({
      category: { id: 'category-1', isActive: false, platform: Platform.instagram },
    });

    await expect(service.submit(baseInput)).rejects.toThrow(BadRequestException);
    expect(supportRequestCreate).not.toHaveBeenCalled();
  });

  it('rejects invalid mobile numbers before writing', async () => {
    const { service, supportRequestCreate } = createService();

    await expect(service.submit({ ...baseInput, mobile: '12345' })).rejects.toThrow(
      BadRequestException,
    );
    expect(supportRequestCreate).not.toHaveBeenCalled();
  });

  it('returns the same result for repeated submissions with one idempotency key', async () => {
    const { service, supportRequestCreate } = createService();

    const [first, second] = await Promise.all([
      service.submit(baseInput),
      service.submit(baseInput),
    ]);

    expect(first).toEqual(second);
    expect(supportRequestCreate).toHaveBeenCalledTimes(1);
  });

  it('does not duplicate attachments for repeated submissions with one idempotency key', async () => {
    const { requestAttachmentCreateMany, service } = createService({
      storedScreenshots: [
        {
          fileSize: 8,
          mimeType: 'image/png',
          originalFileName: 'screen.png',
          storagePath: 'support-requests/request-id/file.png',
        },
      ],
    });

    const [first, second] = await Promise.all([
      service.submit(baseInput, [pngScreenshot]),
      service.submit(baseInput, [pngScreenshot]),
    ]);

    expect(first).toEqual(second);
    expect(first.attachmentCount).toBe(1);
    expect(requestAttachmentCreateMany).toHaveBeenCalledTimes(1);
  });

  it('retries when a generated request number collides', async () => {
    const { service, supportRequestCreate, transaction } = createService({
      requestNumbers: ['RB-2026-ABCDEF', 'RB-2026-GHJKLM'],
      transactionErrors: [
        {
          code: 'P2002',
          meta: { target: ['request_number'] },
        },
      ],
    });

    const result = await service.submit(baseInput);

    expect(result.requestNumber).toBe('RB-2026-GHJKLM');
    expect(transaction).toHaveBeenCalledTimes(2);
    expect(supportRequestCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ requestNumber: 'RB-2026-GHJKLM' }),
    });
  });

  it('does not convert transaction failures into partial success', async () => {
    const { screenshotUploadService, service } = createService({
      storedScreenshots: [
        {
          fileSize: 8,
          mimeType: 'image/png',
          originalFileName: 'screen.png',
          storagePath: 'support-requests/request-id/file.png',
        },
      ],
      statusHistoryError: new Error('history insert failed'),
    });

    await expect(service.submit(baseInput)).rejects.toThrow(InternalServerErrorException);
    expect(screenshotUploadService.cleanup).toHaveBeenCalledWith([
      {
        fileSize: 8,
        mimeType: 'image/png',
        originalFileName: 'screen.png',
        storagePath: 'support-requests/request-id/file.png',
      },
    ]);
  });
});

describe('request number generation', () => {
  it('uses the approved format and avoids confusing characters', () => {
    const requestNumbers = new RequestNumberService();
    const generated = Array.from({ length: 100 }, () =>
      requestNumbers.generate(new Date('2026-07-13T00:00:00.000Z')),
    );

    expect(generated).toEqual(
      expect.arrayContaining([expect.stringMatching(/^RB-2026-[A-Z0-9]{6}$/)]),
    );
    expect(
      generated.every((requestNumber) => !/[O0I1]/.test(requestNumber.split('-')[2] ?? '')),
    ).toBe(true);
  });
});
