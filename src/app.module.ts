import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesModule } from './movies/movies.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';

const configService = new ConfigService();
const testEnv = configService.get<string>('NODE_ENV') === 'test';

@Module({
  imports: [
    !!testEnv
      ? CacheModule.register({
          imports: [ConfigModule],
          inject: [ConfigService],
          isGlobal: true,
        })
      : CacheModule.registerAsync<RedisClientOptions>({
          imports: [ConfigModule],
          inject: [ConfigService],
          isGlobal: true,
          useFactory: async (configService: ConfigService) => ({
            store: redisStore,
            url: configService.getOrThrow<string>('REDIS_URL'),
          }),
        }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    MoviesModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
