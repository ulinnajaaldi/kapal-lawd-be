import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'My First Article',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Article content',
    example: 'This is the content of my article with detailed information...',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
