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

@Entity()
export class User {
  constructor(private configService: ConfigService) {}

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const hash = await argon2.hash(this.password, {
      type: argon2.argon2id,
      memoryCost: 4096,
      timeCost: 3,
      parallelism: 1,
      salt: Buffer.from(this.configService.getOrThrow('USER_PASSWORD_HASH')),
    });
    this.password = hash;
  }
}
