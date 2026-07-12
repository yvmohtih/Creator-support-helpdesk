import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AdminRole } from '@prisma/client';
import argon2 from 'argon2';
import { Response } from 'express';
import { PrismaService } from '../../database/prisma.service';
import { ADMIN_SESSION_COOKIE_DEFAULT } from '../constants/admin-auth.constants';
import { AdminSessionPayload, AuthenticatedAdmin } from '../types/admin-session-payload';
import { LoginRateLimitService } from './login-rate-limit.service';

@Injectable()
export class AdminAuthService {
  constructor(
    @Inject(ConfigService) private readonly config: ConfigService,
    @Inject(JwtService) private readonly jwt: JwtService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(LoginRateLimitService) private readonly loginRateLimit: LoginRateLimitService,
  ) {}

  async login(emailInput: string, password: string, response: Response, ipAddress = 'unknown') {
    const email = this.normalizeEmail(emailInput);
    if (!this.isValidEmail(email)) {
      throw new BadRequestException('Enter a valid email address.');
    }

    const rateLimitKey = `${ipAddress}:${email}`;

    try {
      this.loginRateLimit.assertAllowed(rateLimitKey);
    } catch {
      throw new UnauthorizedException('Too many login attempts. Please try again later.');
    }

    const admin = await this.prisma.adminProfile.findUnique({
      where: { authUserId: email },
    });

    if (!admin || !admin.isActive) {
      this.loginRateLimit.recordFailure(rateLimitKey);
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isPasswordValid = await argon2.verify(
      admin.passwordHash,
      `${password}${this.config.getOrThrow<string>('PASSWORD_HASH_PEPPER')}`,
    );

    if (!isPasswordValid) {
      this.loginRateLimit.recordFailure(rateLimitKey);
      throw new UnauthorizedException('Invalid email or password.');
    }

    this.loginRateLimit.clear(rateLimitKey);

    const payload: AdminSessionPayload = {
      sub: admin.id,
      email: admin.authUserId,
      role: admin.role,
    };
    const ttlSeconds = this.config.get<number>('ADMIN_SESSION_TTL_SECONDS', 86_400);
    const token = await this.jwt.signAsync(payload, { expiresIn: ttlSeconds });

    response.cookie(this.cookieName, token, {
      httpOnly: true,
      maxAge: ttlSeconds * 1000,
      path: '/',
      sameSite: 'lax',
      secure: this.config.get<string>('ADMIN_SESSION_COOKIE_SECURE', 'false') === 'true',
    });

    return this.toAuthenticatedAdmin(admin);
  }

  logout(response: Response) {
    response.clearCookie(this.cookieName, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: this.config.get<string>('ADMIN_SESSION_COOKIE_SECURE', 'false') === 'true',
    });
  }

  async validateToken(token?: string): Promise<AuthenticatedAdmin> {
    if (!token) {
      throw new UnauthorizedException('Authentication required.');
    }

    let payload: AdminSessionPayload;

    try {
      payload = await this.jwt.verifyAsync<AdminSessionPayload>(token);
    } catch {
      throw new UnauthorizedException('Authentication required.');
    }

    const admin = await this.prisma.adminProfile.findUnique({
      where: { id: payload.sub },
    });

    if (!admin || !admin.isActive || admin.authUserId !== payload.email) {
      throw new UnauthorizedException('Authentication required.');
    }

    return this.toAuthenticatedAdmin(admin);
  }

  hasAnyRole(admin: AuthenticatedAdmin, roles: AdminRole[]) {
    return roles.length === 0 || roles.includes(admin.role);
  }

  get cookieName() {
    return this.config.get<string>('ADMIN_SESSION_COOKIE_NAME', ADMIN_SESSION_COOKIE_DEFAULT);
  }

  private normalizeEmail(email: string) {
    return email.trim().toLowerCase();
  }

  private isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private toAuthenticatedAdmin(admin: {
    id: string;
    authUserId: string;
    fullName: string;
    role: AdminRole;
  }): AuthenticatedAdmin {
    return {
      id: admin.id,
      email: admin.authUserId,
      fullName: admin.fullName,
      role: admin.role,
    };
  }
}
