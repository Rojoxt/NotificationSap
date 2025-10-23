import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from 'src/infrastructure/database/db2.datasource';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('ping')
  async ping() {
    const now:Date = new Date();
    const sqlQuery = `call AIPPGM.PUC_OBTPEDIDOSZONA('BTP','2025-08-01','2025-09-30','','')`;
    console.log('SQL Query:', sqlQuery);   
    try {
      const result: any[] = await this.databaseService.query(sqlQuery);


      return {
        message: 'Conexión AS/400 (ODBC) exitosa y ping realizado.',
        databaseTime: result,
      };
    } catch (err) {
      return {
        message: 'Error al conectar con AS/400 (ODBC)',
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }
}
