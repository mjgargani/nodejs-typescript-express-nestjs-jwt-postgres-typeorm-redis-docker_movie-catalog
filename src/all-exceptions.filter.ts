import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from './logger/logger.service';
import { QueryFailedError } from 'typeorm';

type MyResponseObject = {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new LoggerService(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const myResponseObject: MyResponseObject = {
      statusCode: HttpStatus.OK,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: '',
    };

    if (exception instanceof HttpException) {
      myResponseObject.statusCode = exception.getStatus();
      myResponseObject.response = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      myResponseObject.statusCode = HttpStatus.BAD_REQUEST;
      myResponseObject.response = exception.message.replace(/n/g, '');
    } else {
      myResponseObject.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      myResponseObject.response = 'Internal Server Error';
    }

    response.status(myResponseObject.statusCode).json(myResponseObject);

    this.logger.error(
      JSON.stringify(myResponseObject.response),
      AllExceptionsFilter.name,
    );
    super.catch(exception, host);
  }
}
