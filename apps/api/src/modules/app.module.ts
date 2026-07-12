import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthFoundationModule } from './auth/auth-foundation.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { LoggingModule } from '../common/logging/logging.module';
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
    StorageModule,
    HealthModule,
  ],
})
export class AppModule {}
