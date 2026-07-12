import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreatePublicSupportRequestDto } from '../dto/create-public-support-request.dto';
import { PublicSubmitRateLimitService } from '../services/public-submit-rate-limit.service';
import { PublicSupportRequestService } from '../services/public-support-request.service';

@Controller('public/support-requests')
export class PublicSupportRequestController {
  constructor(
    @Inject(PublicSupportRequestService)
    private readonly supportRequests: PublicSupportRequestService,
    @Inject(PublicSubmitRateLimitService)
    private readonly rateLimit: PublicSubmitRateLimitService,
  ) {}

  @Post()
  async create(@Body() body: CreatePublicSupportRequestDto, @Req() request: Request) {
    this.rateLimit.assertAllowed(`${request.ip ?? 'unknown'}:${body.idempotencyKey}`);
    const result = await this.supportRequests.submit(body);

    return {
      success: true,
      data: result,
    };
  }
}
