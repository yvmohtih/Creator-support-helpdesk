import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface Bucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class PublicSubmitRateLimitService {
  private readonly attempts = new Map<string, Bucket>();

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  assertAllowed(key: string) {
    const now = Date.now();
    const maxAttempts = this.config.get<number>('PUBLIC_SUBMIT_MAX_ATTEMPTS', 8);
    const windowMs = this.config.get<number>('PUBLIC_SUBMIT_WINDOW_MS', 600_000);
    const bucket = this.attempts.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.attempts.set(key, { count: 1, resetAt: now + windowMs });
      return;
    }

    if (bucket.count >= maxAttempts) {
      throw new HttpException(
        'We could not submit your request. Please try again.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.attempts.set(key, { count: bucket.count + 1, resetAt: bucket.resetAt });
  }
}
