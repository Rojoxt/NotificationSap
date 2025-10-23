// src/infrastructure/adapter/out/external-api-client/dto/monitoring.dto.ts

import { IsString, IsOptional, IsArray, ValidateNested, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';


// DTO Anidado (MonitoringDetailDTO)
export class MonitoringDetailDTO {
  @IsString()
  @MaxLength(20)
  status!: string;
  
  @IsString()
  webServiceUrl!: string;
  
  @IsString()
  detail!: string;
  
  startDateTime!: Date;
  
  endDateTime!: Date;
}

// DTO Principal (MonitoringDTO)
export class MonitoringDTO {
  @IsString()
  jsonData!: string;
  
  @IsString()
  referenceDocument!: string;
  
  @IsString()
  status!: string;
  
  @IsString()
  message!: string;
  
  startDateTime!: Date;
  
  endDateTime!: Date;
  
  @IsString()
  webServiceUrl!: string;
  
  @IsString()
  @MaxLength(2)
  country!: string;
  
  @IsString()
  integrator!: string;
  
  @IsString()
  @MaxLength(10)
  organizationCode!: string;
  
  @IsOptional()
  @IsString()
  jsonResponse?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MonitoringDetailDTO)
  monitoringDetail!: MonitoringDetailDTO[];
}