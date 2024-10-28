import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional({ nullable: true })
  @IsString()
  slug: string;

  @ApiProperty({ format: 'binary' })
  @IsString()
  image: string;

  @ApiProperty()
  @IsString()
  description: string;
}
