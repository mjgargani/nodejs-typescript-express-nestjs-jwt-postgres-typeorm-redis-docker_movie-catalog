import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'Hello World!' })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
