import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment content',
    example: 'This is a great article! Very informative and well-written.',
    minLength: 1,
    maxLength: 1000,
  })
  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Content is required' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(1000, { message: 'Content must not exceed 1000 characters' })
  content: string;

  @ApiProperty({
    description: 'ID of the article to comment on',
    example: 'cuid_example_123',
  })
  @IsString({ message: 'Article ID must be a string' })
  @IsNotEmpty({ message: 'Article ID is required' })
  articleId: string;
}
