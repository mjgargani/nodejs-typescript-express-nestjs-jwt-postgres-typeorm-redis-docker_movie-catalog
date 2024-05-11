import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new LoggerService(AuthController.name);

  @Post('login')
  async login(@Request() req) {
    const { username, password } = req.body;
    return this.authService.login(username, password);
  }
}
