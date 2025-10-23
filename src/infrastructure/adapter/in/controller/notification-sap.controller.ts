import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, UseGuards } from '@nestjs/common';
import { NotificationRequest } from '../dto/notification-request.dto';
import { ProcessNotificationResultUseCase } from 'src/application/port/in/process-notification-result.use-case';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { JwtAuthGuard } from 'src/security/guards/jwt-auth.guard';

@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
export class NotificationResponseController {
  constructor(private readonly useCase: ProcessNotificationResultUseCase) {}

  @Post('resultado-sap-notificacion-pt')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMINISTRATOR')
  async receiveNotification(@Body() request: NotificationRequest) {

    return this.useCase.processResult(request);
  }
}
