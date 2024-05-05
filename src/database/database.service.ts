import { Injectable, OnModuleInit } from '@nestjs/common';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private connection: Connection) {}

  async onModuleInit() {
    if (this.connection.isConnected) {
      console.log('Successfully connected to the database');
    } else {
      console.error('Error connecting to the database');
      throw new Error('Error connecting to the database');
    }
  }
}
