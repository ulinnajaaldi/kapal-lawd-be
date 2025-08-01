import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LikeArticleDto {
  @ApiProperty({
    description: 'Article ID to like',
    example: 'cm123456789abcdef',
  })
  @IsNotEmpty()
  @IsString()
  articleId: string;
}
