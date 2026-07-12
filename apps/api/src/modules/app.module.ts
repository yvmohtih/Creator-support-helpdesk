import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthFoundationModule } from './auth/auth-foundation.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { LoggingModule } from '../common/logging/logging.module';
import { PublicSupportModule } from './public-support/public-support.module';
import { StorageModule } from './storage/storage.module';
import { validateEnvironment } from '../config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../../.env', '.env'],
      isGlobal: true,
      validate: validateEnvironment,
    }),
    LoggingModule,
    DatabaseModule,
    AuthFoundationModule,
    PublicSupportModule,
    StorageModule,
    HealthModule,
  ],
})
export class AppModule {}
