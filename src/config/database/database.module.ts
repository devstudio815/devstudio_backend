// src/config/database/database.module.ts
import { Module, Global } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { databasePoolProvider } from './database.config';
import { ConfigModule } from '@nestjs/config';


@Global()
@Module({
  imports :[ConfigModule],
  providers: [databasePoolProvider, DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}