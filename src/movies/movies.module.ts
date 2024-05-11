import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie]),
    JwtModule.register({
      secret: configService.getOrThrow<string>('JWT_SECRET'),
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
