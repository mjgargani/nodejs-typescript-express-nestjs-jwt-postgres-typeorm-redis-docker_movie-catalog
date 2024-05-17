import { ConfigService } from '@nestjs/config';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Movie {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty()
  @Column({ nullable: true })
  year: number;

  @ApiProperty()
  @Column({ nullable: true })
  director: string;

  @ApiProperty()
  @Column({ nullable: true })
  genre: string;

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
}
