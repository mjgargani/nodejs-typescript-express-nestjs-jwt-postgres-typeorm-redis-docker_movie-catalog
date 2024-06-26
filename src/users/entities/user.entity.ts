import 'dotenv/config';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: false })
  username: string;

  @ApiProperty()
  @Column({ nullable: false })
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  email: string;

  @ApiProperty()
  @CreateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: new Date().toISOString(),
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    default: new Date().toISOString(),
    onUpdate: new Date().toISOString(),
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const configService = new ConfigService();
    const secret = Buffer.from(
      configService.getOrThrow('USER_PASSWORD_HASH').toString(),
      'hex',
    );
    const hash = await argon2.hash(this.password, {
      secret,
    });
    this.password = hash;
  }
}
