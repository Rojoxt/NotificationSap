import { Expose, Type } from 'class-transformer';
import { IsArray, ValidateNested, IsEnum, IsOptional, IsString } from 'class-validator';

export enum ResultStatus {
  OK = 'OK',
  ERROR = 'ERROR',
}

/**
 * DTO anidado para cada resultado individual
 */
export class NotificationResultItemDto {
  @Expose({ name: 'NUM_OP' })
  @IsString()
  numOp!: string;

  @Expose({ name: 'STATUS' })
  @IsEnum(ResultStatus)
  status!: ResultStatus;

  @Expose({ name: 'MESSAGE' })
  @IsOptional()
  @IsString()
  message?: string;
}

/**
 * DTO principal de respuesta, equivalente a NotificationResultResponse
 */
export class NotificationResultResponseDto {
  @Expose({ name: 'results' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationResultItemDto)
  results!: NotificationResultItemDto[];
}