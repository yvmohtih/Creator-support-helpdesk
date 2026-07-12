import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminAuthController } from './controllers/admin-auth.controller';
import { AdminProtectedController } from './controllers/admin-protected.controller';
import { AdminAuthService } from './services/admin-auth.service';
import { LoginRateLimitService } from './services/login-rate-limit.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AdminAuthController, AdminProtectedController],
  providers: [AdminAuthService, LoginRateLimitService],
  exports: [JwtModule],
})
export class AuthFoundationModule {}
