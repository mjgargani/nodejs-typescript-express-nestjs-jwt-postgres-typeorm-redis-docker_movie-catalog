import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtGuard } from '../jwt/jwt.guard';
import { LoggerService } from '../logger/logger.service';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { Movie } from './entities/movie.entity';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}
  private readonly logger = new LoggerService(MoviesController.name);

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({
    status: 201,
    description: 'The creation of a new movie',
    type: Movie,
  })
  @UseGuards(JwtGuard)
  @Post()
  async create(@Body() createMovieDto: Movie) {
    return this.moviesService.create(createMovieDto);
  }

  @ApiResponse({
    status: 200,
    description: 'List of all movies',
    type: [Movie],
  })
  @Get()
  async findAll() {
    return this.moviesService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Movie by id',
    type: Movie,
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({
    status: 200,
    description: 'Movie updated',
    type: Movie,
  })
  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @ApiHeader({
    name: 'authorization',
    description: 'JWT token',
  })
  @ApiResponse({
    status: 200,
    description: 'Movie deleted',
    type: class DeleteResponse {
      id: string;
    },
  })
  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.moviesService.remove(id);
    return { id };
  }
}
