// src/infrastructure/adapter/out/external-api-client/external-api.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MonitorApiService } from './monitor-api-service';


@Module({
  imports: [
    ConfigModule,
  ],
  providers: [MonitorApiService],
  exports: [MonitorApiService],
})
export class MonitorApiModule {}