import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface LoginAttemptBucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class LoginRateLimitService {
  private readonly attempts = new Map<string, LoginAttemptBucket>();

  constructor(@Inject(ConfigService) private readonly config: ConfigService) {}

  assertAllowed(key: string) {
    const now = Date.now();
    const maxAttempts = this.config.get<number>('ADMIN_LOGIN_MAX_ATTEMPTS', 5);
    const windowMs = this.config.get<number>('ADMIN_LOGIN_WINDOW_MS', 600_000);
    const bucket = this.attempts.get(key);

    if (!bucket || bucket.resetAt <= now) {
      this.attempts.set(key, { count: 0, resetAt: now + windowMs });
      return;
    }

    if (bucket.count >= maxAttempts) {
      throw new Error('LOGIN_RATE_LIMITED');
    }
  }

  recordFailure(key: string) {
    const now = Date.now();
    const windowMs = this.config.get<number>('ADMIN_LOGIN_WINDOW_MS', 600_000);
    const bucket = this.attempts.get(key) ?? { count: 0, resetAt: now + windowMs };

    this.attempts.set(key, {
      count: bucket.count + 1,
      resetAt: bucket.resetAt,
    });
  }

  clear(key: string) {
    this.attempts.delete(key);
  }
}
