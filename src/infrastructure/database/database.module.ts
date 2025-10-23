import { Module } from '@nestjs/common';
import { DatabaseService } from './db2.datasource';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
