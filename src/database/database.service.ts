import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private connection: Connection) {}
  private readonly logger = new LoggerService(DatabaseService.name);

  async onModuleInit() {
    if (this.connection.isConnected) {
      this.logger.log(
        'Successfully connected to the database',
        DatabaseService.name,
      );
    } else {
      const message = 'Internal Server Error';
      this.logger.error('Error connecting to the database', message);
      throw new Error(message);
    }
  }
}
