import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../src/database/database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'sqljs',
        entities: [__dirname + '/../src/**/*.entity{.ts,.js}'],
        synchronize: true,
        dropSchema: true,
        autoLoadEntities: true,
      }),
    }),
  ],
  providers: [
    DatabaseService,
    {
      provide: getRepositoryToken(YourEntity),
      useClass: Repository,
    },
  ],
  exports: [DatabaseService],
})
export class DatabaseModuleMock {}
