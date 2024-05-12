import { Controller, Post, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
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
  async login(@Body(ValidationPipe) login: LoginDto) {
    const { username, password } = login;
    return this.authService.login(username, password);
  }
}
