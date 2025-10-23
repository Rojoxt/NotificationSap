import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsOptional, ValidateNested, IsArray } from 'class-validator';

export class  NotificationRequest {
  @Expose({ name: 'status_ordenes' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationStatusDto)
  statusOrders!: NotificationStatusDto[];
}

export class NotificationStatusDto {
  @Expose({ name: 'NUM_OP' })
  @IsString()
  operationNumber: string;

  @Expose({ name: 'STATUS' })
  @IsOptional()
  @IsString()
  status: string;

  @Expose({ name: 'ERROR' })
  @IsOptional()
  @IsString()
  error: string;

  @Expose({ name: 'MESSAGE' })
  @IsOptional()
  @IsString()
  message: string;

  @Expose({ name: 'PE_CODIGO' })
  @IsOptional()
  @IsString()
  peCode: string;

  @Expose({ name: 'GUI_YOB' })
  @IsString()
  guiYob: string;
}
