import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { StorageService } from '../../storage/storage.service';

export interface UploadedScreenshotFile {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

export interface StoredScreenshot {
  fileSize: number;
  mimeType: string;
  originalFileName: string;
  storagePath: string;
}

const mimeToExtension = new Map([
  ['image/jpeg', ['jpg', 'jpeg']],
  ['image/png', ['png']],
  ['image/webp', ['webp']],
]);

@Injectable()
export class ScreenshotUploadService {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(StorageService) private readonly storage: StorageService,
  ) {}

  async validateAndStore(files: UploadedScreenshotFile[], supportRequestId: string) {
    const normalizedFiles = files ?? [];
    const limits = this.limits();

    if (normalizedFiles.length === 0) {
      return [];
    }

    if (normalizedFiles.length > limits.maxFiles) {
      throw new BadRequestException(`You can upload up to ${limits.maxFiles} screenshots.`);
    }

    const combinedSize = normalizedFiles.reduce((total, file) => total + file.size, 0);

    if (combinedSize > limits.maxCombinedSizeBytes) {
      throw new BadRequestException('The selected screenshots are too large together.');
    }

    const fileFingerprints = new Set<string>();

    for (const file of normalizedFiles) {
      const fingerprint = `${file.originalname}:${file.size}`;

      if (fileFingerprints.has(fingerprint)) {
        throw new BadRequestException('This screenshot is already selected.');
      }

      fileFingerprints.add(fingerprint);
    }

    const validatedFiles = normalizedFiles.map((file) =>
      this.validateFile(file, limits.maxFileSizeBytes),
    );
    const storedFiles: StoredScreenshot[] = [];

    try {
      for (const file of validatedFiles) {
        const fileId = randomUUID();
        const storagePath = `support-requests/${supportRequestId}/${fileId}.${file.extension}`;

        await this.storage.putPrivateObject({
          body: file.buffer,
          contentLength: file.size,
          contentType: file.mimeType,
          storagePath,
        });

        storedFiles.push({
          fileSize: file.size,
          mimeType: file.mimeType,
          originalFileName: file.originalFileName,
          storagePath,
        });
      }
    } catch {
      await this.cleanup(storedFiles);
      throw new InternalServerErrorException(
        'We could not upload this screenshot. Please try again.',
      );
    }

    return storedFiles;
  }

  async cleanup(storedFiles: StoredScreenshot[]) {
    await Promise.allSettled(
      storedFiles.map((file) => this.storage.deleteObject(file.storagePath)),
    );
  }

  private validateFile(file: UploadedScreenshotFile, maxFileSizeBytes: number) {
    const originalFileName = this.safeOriginalFilename(file.originalname);
    const extension = this.extensionFromName(originalFileName);
    const allowedExtensions = mimeToExtension.get(file.mimetype);

    if (!allowedExtensions || !extension || !allowedExtensions.includes(extension)) {
      throw new BadRequestException('This file type is not supported.');
    }

    if (file.size > maxFileSizeBytes) {
      throw new BadRequestException('This image is too large. Choose an image smaller than 5 MB.');
    }

    if (!this.hasExpectedSignature(file.buffer, file.mimetype)) {
      throw new BadRequestException('This file type is not supported.');
    }

    return {
      buffer: file.buffer,
      extension: extension === 'jpeg' ? 'jpg' : extension,
      mimeType: file.mimetype,
      originalFileName,
      size: file.size,
    };
  }

  private hasExpectedSignature(buffer: Buffer, mimeType: string) {
    if (mimeType === 'image/jpeg') {
      return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    }

    if (mimeType === 'image/png') {
      return (
        buffer.length >= 8 &&
        buffer[0] === 0x89 &&
        buffer[1] === 0x50 &&
        buffer[2] === 0x4e &&
        buffer[3] === 0x47 &&
        buffer[4] === 0x0d &&
        buffer[5] === 0x0a &&
        buffer[6] === 0x1a &&
        buffer[7] === 0x0a
      );
    }

    if (mimeType === 'image/webp') {
      return (
        buffer.length >= 12 &&
        buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        buffer.subarray(8, 12).toString('ascii') === 'WEBP'
      );
    }

    return false;
  }

  private limits() {
    return {
      maxCombinedSizeBytes: this.config.get<number>(
        'SCREENSHOT_MAX_COMBINED_SIZE_BYTES',
        12_582_912,
      ),
      maxFileSizeBytes: this.config.get<number>('SCREENSHOT_MAX_FILE_SIZE_BYTES', 5_242_880),
      maxFiles: this.config.get<number>('SCREENSHOT_MAX_FILES', 3),
    };
  }

  private extensionFromName(fileName: string) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension && extension !== fileName.toLowerCase() ? extension : undefined;
  }

  private safeOriginalFilename(fileName: string) {
    const baseName = fileName.split(/[\\/]/).pop()?.trim() || 'screenshot';
    return baseName.slice(0, 255);
  }
}
