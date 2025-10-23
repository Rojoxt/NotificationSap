import { Injectable, Logger } from "@nestjs/common";
import { UpdateNotificationStatusPort } from "src/application/port/out/notification-response-repository,port";
import { DatabaseService } from "src/infrastructure/database/db2.datasource";


@Injectable()
export class Db2UpdateNotificationAdapter implements UpdateNotificationStatusPort {
  private readonly logger = new Logger(Db2UpdateNotificationAdapter.name);

  constructor(private readonly db2: DatabaseService) {}

  async updateNotification(
    numOp: string,
    guiYob: string,
    status: string,
    message: string,
    peCodigo: string,
    pdate: string
  ): Promise<void> {
    const sql = `CALL BPCPGM.PSCM_ACTUALIZAR_ESTADO_NOTIFICACION_PT(?, ?, ?, ?, ?);`;
    try {
      
      await this.db2.query(
        'CALL BPCPGM.PSCM_ACTUALIZAR_ESTADO_NOTIFICACION_PT(?, ?, ?, ?, ?, ?)',
         [guiYob ,status ,message , peCodigo, pdate, numOp],
        );
      this.logger.log(`✅ Estado de notificación actualizado correctamente`);
    } catch (error) {
      this.logger.error('❌ Error ejecutando procedimiento DB2', error);
      throw new Error(`Error al actualizar  notificación en DB2: ${error}`);
    }
  }
}