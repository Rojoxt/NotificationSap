import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // 👈 Importa ConfigService
import * as odbc from 'odbc';
import { Connection } from 'odbc'; // Asegúrate de importar el tipo Connection

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection; // Usa el tipo Connection de odbc

  // 1. Inyecta el ConfigService en el constructor
  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    console.log('🔄 Conectando al AS400...');
    
    // 2. Obtén los valores de las variables de entorno
    const driverName = this.configService.get<string>('AS400_ODBC_DRIVER_NAME');
    const systemIp = this.configService.get<string>('AS400_SYSTEM_IP');
    const username = this.configService.get<string>('AS400_USERNAME');
    const password = this.configService.get<string>('AS400_PASSWORD');
    const naming = this.configService.get<string>('AS400_NAMING_CONVENTION');
    const libraries = this.configService.get<string>('AS400_DEFAULT_LIBRARIES');                            // Naming mode
    
    // 3. Construye la cadena de conexión usando las variables
    const connectionString = 
      `DRIVER=${driverName};` +
      `SYSTEM=${systemIp};` +
      `UID=${username};` +
      `PWD=${password};` +
      `Naming=${naming};DefaultLibraries=${libraries};`;
    try {
        this.connection = await odbc.connect(connectionString);
        console.log(`✅ Conectado a AS400: ${systemIp}`);
    } catch (error) {
        console.error('❌ Error al conectar al AS400:', error);
        // Opcional: relanzar el error o manejarlo de otra forma
        throw error;
    }
  }

  async query(sql: string, params: any[] = []) {
    if (!this.connection) {
      throw new Error('No hay conexión activa con AS400');
    }
    const result = await this.connection.query(sql, params);
    return result;
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
      console.log('🔒 Conexión AS400 cerrada');
    }
  }
}

