import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesRepository.save(createMovieDto);
  }

  async findAll() {
    return this.moviesRepository.find();
  }

  async findOne(id: string) {
    return this.moviesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    return this.moviesRepository.update(id, updateMovieDto);
  }

  async remove(id: string) {
    return this.moviesRepository.delete(id);
  }
}
