import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: CreateUserDto['username'],
    password: CreateUserDto['password'],
  ): Promise<any> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
    });

    const configService = new ConfigService();
    const secret = Buffer.from(
      configService.getOrThrow('USER_PASSWORD_HASH').toString(),
      'hex',
    );

    if (
      user &&
      (await argon2.verify(user.password, password, {
        secret,
      }))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(
    username: CreateUserDto['username'],
    password: CreateUserDto['password'],
  ) {
    const validatedUser = await this.validateUser(username, password);
    if (!validatedUser) {
      throw new UnauthorizedException('Login failed');
    }

    const payload = {
      username: validatedUser.username,
      email: validatedUser.email,
      id: validatedUser.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
