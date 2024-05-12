import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../jwt/jwt.guard';
import { LoggerService } from '../logger/logger.service';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private readonly logger = new LoggerService(UsersController.name);

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The creation of a new user',
    type: User,
  })
  @Post()
  async create(@Body() createUserDto: User) {
    return this.usersService.create(createUserDto);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    type: [User],
  })
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User by id',
    type: User,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: User,
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    type: class DeleteResponse {
      id: string;
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { id };
  }
}
