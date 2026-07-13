import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { PublicSupportRequestController } from './controllers/public-support-request.controller';
import { PublicSubmitRateLimitService } from './services/public-submit-rate-limit.service';
import { PublicSupportRequestService } from './services/public-support-request.service';
import { RequestNumberService } from './services/request-number.service';
import { ScreenshotUploadService } from './services/screenshot-upload.service';

@Module({
  imports: [StorageModule],
  controllers: [PublicSupportRequestController],
  providers: [
    PublicSupportRequestService,
    PublicSubmitRateLimitService,
    RequestNumberService,
    ScreenshotUploadService,
  ],
})
export class PublicSupportModule {}
