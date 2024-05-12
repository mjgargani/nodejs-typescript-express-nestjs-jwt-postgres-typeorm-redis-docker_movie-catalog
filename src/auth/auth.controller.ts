import { Controller, Request, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

class LoginResponse {
  @ApiProperty()
  access_token: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  private readonly logger = new LoggerService(AuthController.name);

  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Login',
    type: LoginResponse,
  })
  @Post('login')
  async login(@Request() req) {
    const { username, password } = req.body;
    return this.authService.login(username, password);
  }
}
