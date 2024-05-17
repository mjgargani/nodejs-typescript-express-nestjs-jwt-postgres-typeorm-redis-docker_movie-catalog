import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    const newUser = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async findAll(): Promise<CreateUserDto[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<CreateUserDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });
    if (updateUserDto.password) {
      user.password = updateUserDto.password;
      await user.hashPassword();
    }
    await this.usersRepository.save(Object.assign(user, updateUserDto));
    return user;
  }

  async remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
