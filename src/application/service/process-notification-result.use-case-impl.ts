import { Inject, Injectable, Logger, Scope } from "@nestjs/common";
import { REQUEST } from '@nestjs/core'; // 👈 ¡Importante!
import { NotificationRequest } from "src/infrastructure/adapter/in/dto/notification-request.dto";
import { NotificationResultItemDto, NotificationResultResponseDto, ResultStatus } from "src/infrastructure/adapter/in/dto/notification-response.dto";
import { ProcessNotificationResultUseCase } from "../port/in/process-notification-result.use-case";
import { UpdateNotificationStatusPort } from "../port/out/notification-response-repository,port";
import { MONITORING_CONTEXT_KEY, MonitoringContext } from "src/infrastructure/adapter/out/monitor-api-client/monitoring-context";


@Injectable({ scope: Scope.REQUEST })
export class ProcessNotificationResultUseCaseImpl implements ProcessNotificationResultUseCase {

  private readonly logger = new Logger(ProcessNotificationResultUseCaseImpl.name);
  private monitorContext: MonitoringContext;
  private readonly INTEGRATOR: string = "RESULTADO_SAP";
  private readonly ORG: string = "MX_SCM";


  constructor(
    private readonly db2UpdateNotificationAdapter: UpdateNotificationStatusPort,
    @Inject(REQUEST) private readonly request: any,
  ) { }

  async processResult(request: NotificationRequest): Promise<NotificationResultResponseDto> {
    // Inicializamos el monitorContext al inicio del proceso
    this.monitorContext = this.request[MONITORING_CONTEXT_KEY] as MonitoringContext;

    const date = new Date();
    const today = date.toLocaleString().slice(0, 10).replace(/-/g, '');
    console.log(`TODAY: ${today}`); // 👉 "20251022"


    const referenceDocument: string = request.statusOrders.map(o => o.guiYob).join(',');

    // Registrar inicio del proceso
    if (this.monitorContext != null) {
      this.monitorContext.setMonitorHead(referenceDocument, this.INTEGRATOR, this.ORG);
    }

    const source: string = "SP: BPCPGM.PSCM_ACTUALIZAR_ESTADO_NOTIFICACION_PT";

    const startTime = new Date();

    const updatePromises = request.statusOrders.map(async (o) => {
      try {
        await this.db2UpdateNotificationAdapter.updateNotification(o.operationNumber, o.guiYob, o.status, o.message, o.peCode, today);

        this.monitorContext?.addDetail('SUCCESS', source, `Sp Llamado ${o.operationNumber} actualizada.`, startTime);
        const resultItem = new NotificationResultItemDto();
        resultItem.numOp = o.operationNumber;
        resultItem.status = ResultStatus.OK;
        resultItem.message = 'Estado Actualizado';
        return resultItem; // 👈 Devuelve la Promise<NotificationResultItemDto>

      } catch (error) {

        this.monitorContext?.addDetail('ERROR', source, `Fallo la actualización de ${o.operationNumber}: ${error.message}`, startTime);
        this.logger.error(`Failed to process order NUM_OP: ${o.operationNumber}`, error.stack); // 👈 CORRECCIÓN: el log debe estar antes del return o la excepción

        const resultItem = new NotificationResultItemDto();
        resultItem.numOp = o.operationNumber;
        resultItem.status = ResultStatus.ERROR;
        resultItem.message = 'Estado No Actualizado';
        return resultItem; // 👈 Devuelve la Promise<NotificationResultItemDto>
      }
    });
    // 2. Esperar a que todas las promesas se resuelvan
    const finalResults = await Promise.all(updatePromises);

    // 3. CONSTRUIR EL DTO DE RESPUESTA FINAL (Ajuste Necesario)
    const responseDto = new NotificationResultResponseDto();
    responseDto.results = finalResults; // 👈 Asigna el array a la propiedad 'results'

    const allOk = finalResults.every(r => r.status === ResultStatus.OK);

    if (this.monitorContext) {
      this.monitorContext.status = allOk ? 'OK' : 'ERROR_PARCIAL';
      this.monitorContext.message = allOk ? 'Proceso completo exitoso.' : 'Proceso finalizado con errores parciales.';

    } else {
      this.logger.warn('MonitorContext no está disponible en esta solicitud');
    }

    return responseDto;
  }
}