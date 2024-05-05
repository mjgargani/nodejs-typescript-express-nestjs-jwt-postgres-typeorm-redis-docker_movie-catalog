import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { getTypeOrmConfig } from './src/database/database.config';

config();

const configService = new ConfigService();
const typeOrmConfig = getTypeOrmConfig(configService);

export default new DataSource(typeOrmConfig as DataSourceOptions);
