import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  MinLength,
} from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  director?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(4)
  genre?: string;
}
