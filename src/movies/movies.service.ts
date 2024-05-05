import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
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
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.moviesRepository.save(createMovieDto);
  }

  async findAll() {
    const getCache = await this.cacheManager.get('movies');
    if (getCache) {
      return getCache;
    } else {
      const movies = await this.moviesRepository.find();
      await this.cacheManager.set('movies', movies);
      return movies;
    }
  }

  async findOne(id: string) {
    const getCache = await this.cacheManager.get(`movie-${id}`);
    if (getCache) {
      return getCache;
    } else {
      const movie = await this.moviesRepository.findOne({
        where: {
          id,
        },
      });
      await this.cacheManager.set(`movie-${id}`, movie);
      return movie;
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDto) {
    await this.moviesRepository.update(id, updateMovieDto);
    const updated = await this.moviesRepository.findOne({
      where: {
        id,
      },
    });
    return updated;
  }

  async remove(id: string) {
    return this.moviesRepository.delete(id);
  }
}
