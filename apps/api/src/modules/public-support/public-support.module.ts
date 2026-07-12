import { Module } from '@nestjs/common';
import { PublicSupportRequestController } from './controllers/public-support-request.controller';
import { PublicSubmitRateLimitService } from './services/public-submit-rate-limit.service';
import { PublicSupportRequestService } from './services/public-support-request.service';
import { RequestNumberService } from './services/request-number.service';

@Module({
  controllers: [PublicSupportRequestController],
  providers: [PublicSupportRequestService, PublicSubmitRateLimitService, RequestNumberService],
})
export class PublicSupportModule {}
