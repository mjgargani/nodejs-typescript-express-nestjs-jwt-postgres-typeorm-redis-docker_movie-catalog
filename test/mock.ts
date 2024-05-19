import 'dotenv/config';
import { ConfigService } from '@nestjs/config';
import { MockProxy, mock } from 'jest-mock-extended';

process.env.POSTGRES_URL = '';
process.env.REDIS_URL = '';
process.env.USER_PASSWORD_HASH = 'password_secret';
process.env.JWT_SECRET = 'jwt_secret';

export const configServiceMock = () => {
  const configService: MockProxy<ConfigService> = mock<ConfigService>();
  return configService.getOrThrow.mockImplementation(
    (key: string) => process.env[key] as unknown,
  );
};
