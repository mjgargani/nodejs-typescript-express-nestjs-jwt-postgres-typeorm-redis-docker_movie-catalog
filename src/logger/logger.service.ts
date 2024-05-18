import 'dotenv/config';
import { ConsoleLogger, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

@Injectable()
export class LoggerService extends ConsoleLogger {
  async write(entry: string) {
    const filePath = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(path.join(filePath, 'api.log'))) {
      await fsPromises.mkdir(filePath, { recursive: true });
      await fsPromises.writeFile(path.join(filePath, 'api.log'), '', {
        encoding: 'utf-8',
      });
    }
    await fsPromises.appendFile(path.join(filePath, 'api.log'), `${entry}\n`, {
      encoding: 'utf-8',
    });
  }

  async log(message: string, context?: string) {
    const testEnv = process.env.NODE_ENV === 'test' ? '[Test environment]' : '';
    const entry = `${new Date().toISOString()}${testEnv && `\t${testEnv}`}\t${context}\t${message}`;
    await this.write(entry);
    super.log(`${testEnv} ${message}`, context);
  }

  async error(message: string, trace: string) {
    const testEnv = process.env.NODE_ENV === 'test' ? '[Test environment]' : '';
    const entry = `${new Date().toISOString()}${testEnv && `\t${testEnv}`}\t${trace}\t${message}`;
    await this.write(entry);
    super.error(`${testEnv} ${message}`, trace);
  }
}
