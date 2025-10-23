import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { NotificationResponseController } from './infrastructure/adapter/in/controller/notification-sap.controller';
import {ProcessNotificationResultUseCase} from './application/port/in/process-notification-result.use-case'
import { ProcessNotificationResultUseCaseImpl } from './application/service/process-notification-result.use-case-impl';
import { UpdateNotificationStatusPort } from './application/port/out/notification-response-repository,port';
import { Db2UpdateNotificationAdapter } from './infrastructure/adapter/out/persitence/procedures/update-notificacion-status.adapter';
import { MonitorApiModule } from './infrastructure/adapter/out/monitor-api-client/monitor-api-module';
import { MonitoringInterceptor } from './infrastructure/interceptor/monitoring.interceptor';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    // 🔹 Carga las variables del archivo .env automáticamente
    ConfigModule.forRoot({
      isGlobal: true, // disponible en toda la app
    }),
    SharedModule, // 👈 Importa el módulo compartido que maneja las fechas
    DatabaseModule,
    MonitorApiModule,
    SecurityModule,
  ],
  controllers: [AppController, NotificationResponseController],
  providers: [
    AppService,
    MonitoringInterceptor,
    {
      provide: ProcessNotificationResultUseCase,
      useClass: ProcessNotificationResultUseCaseImpl,
    },
    {
      provide: UpdateNotificationStatusPort,
      useClass: Db2UpdateNotificationAdapter
    },

  ],
})
export class AppModule {}
