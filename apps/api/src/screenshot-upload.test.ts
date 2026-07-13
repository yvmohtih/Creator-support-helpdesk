import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import {
  ScreenshotUploadService,
  UploadedScreenshotFile,
} from './modules/public-support/services/screenshot-upload.service';

const pngBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
const jpgBytes = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
const webpBytes = Buffer.from('RIFFxxxxWEBP', 'ascii');

function file(input: Partial<UploadedScreenshotFile> = {}): UploadedScreenshotFile {
  const buffer = input.buffer ?? pngBytes;

  return {
    buffer,
    mimetype: input.mimetype ?? 'image/png',
    originalname: input.originalname ?? 'screen.png',
    size: input.size ?? buffer.length,
  };
}

function createService(options?: { putError?: Error }) {
  const config = {
    get: vi.fn((key: string, fallback: number) => fallback),
  };
  const storage = {
    deleteObject: vi.fn(async () => undefined),
    putPrivateObject: vi.fn(async () => {
      if (options?.putError) {
        throw options.putError;
      }
    }),
  };
  const service = new ScreenshotUploadService(config as never, storage as never);

  return { service, storage };
}

describe('screenshot upload validation and storage', () => {
  it('uploads one valid image using a safe generated storage path', async () => {
    const { service, storage } = createService();

    const result = await service.validateAndStore(
      [file({ originalname: 'Telugu సమస్య.png' })],
      'request-id',
    );

    expect(result).toHaveLength(1);
    expect(result[0]?.originalFileName).toBe('Telugu సమస్య.png');
    expect(result[0]?.storagePath).toMatch(/^support-requests\/request-id\/[0-9a-f-]{36}\.png$/);
    expect(result[0]?.storagePath).not.toContain('Telugu');
    expect(storage.putPrivateObject).toHaveBeenCalledWith({
      body: pngBytes,
      contentLength: pngBytes.length,
      contentType: 'image/png',
      storagePath: result[0]?.storagePath,
    });
  });

  it('accepts jpeg and webp signatures', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore(
        [
          file({ buffer: jpgBytes, mimetype: 'image/jpeg', originalname: 'screen.jpg' }),
          file({ buffer: webpBytes, mimetype: 'image/webp', originalname: 'screen.webp' }),
        ],
        'request-id',
      ),
    ).resolves.toHaveLength(2);
  });

  it('rejects more than three files', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore([file(), file(), file(), file()], 'request-id'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects duplicate file selections', async () => {
    const { service } = createService();

    await expect(service.validateAndStore([file(), file()], 'request-id')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects files over five MB', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore([file({ size: 5 * 1024 * 1024 + 1 })], 'request-id'),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects combined files over twelve MB', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore(
        [
          file({ size: 4 * 1024 * 1024 }),
          file({ size: 4 * 1024 * 1024 }),
          file({ size: 4 * 1024 * 1024 + 1 }),
        ],
        'request-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects unsupported MIME types', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore(
        [
          file({
            buffer: Buffer.from('%PDF'),
            mimetype: 'application/pdf',
            originalname: 'bad.pdf',
          }),
        ],
        'request-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('rejects misleading extensions and signatures', async () => {
    const { service } = createService();

    await expect(
      service.validateAndStore(
        [file({ buffer: jpgBytes, mimetype: 'image/jpeg', originalname: 'screen.png' })],
        'request-id',
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.validateAndStore(
        [
          file({
            buffer: Buffer.from('not an image'),
            mimetype: 'image/png',
            originalname: 'screen.png',
          }),
        ],
        'request-id',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('cleans up already-uploaded files when a later upload fails', async () => {
    const storage = {
      deleteObject: vi.fn(async () => undefined),
      putPrivateObject: vi
        .fn()
        .mockResolvedValueOnce(undefined)
        .mockRejectedValueOnce(new Error('storage unavailable')),
    };
    const config = { get: vi.fn((key: string, fallback: number) => fallback) };
    const service = new ScreenshotUploadService(config as never, storage as never);

    await expect(
      service.validateAndStore([file(), file({ originalname: 'second.png' })], 'request-id'),
    ).rejects.toThrow(InternalServerErrorException);
    expect(storage.deleteObject).toHaveBeenCalledWith(expect.stringMatching(/^support-requests\//));
  });
});
