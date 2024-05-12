import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  year?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  genre?: string;
}
