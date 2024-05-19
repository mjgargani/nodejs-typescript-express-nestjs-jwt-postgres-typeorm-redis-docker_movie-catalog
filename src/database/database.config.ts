import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const testEnv = configService.get<string>('NODE_ENV') === 'test';

  return {
    type: !!testEnv ? 'sqlite' : 'postgres',
    url: !!testEnv
      ? undefined
      : configService.getOrThrow<string>('POSTGRES_URL'),
    database: !!testEnv ? ':memory:' : undefined,
    synchronize: !!testEnv,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    dropSchema: !!testEnv,
  };
};
