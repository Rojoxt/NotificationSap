// src/security/security.module.ts

import { Module } from '@nestjs/common';
import { JwtServiceUseCase } from './jwt.service.usecase';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  providers: [JwtServiceUseCase, JwtAuthGuard],
  exports: [JwtServiceUseCase, JwtAuthGuard],
})
export class SecurityModule {}