import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LikeResponseDto {
  @ApiProperty({
    description: 'Like ID',
    example: 'cm123456789abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'User ID who liked',
    example: 'cm123456789abcdef',
  })
  userId: string;

  @ApiProperty({
    description: 'Article ID that was liked',
    example: 'cm123456789abcdef',
  })
  articleId: string;

  @ApiProperty({
    description: 'When the like was created',
    example: '2025-08-01T21:40:33.000Z',
  })
  createdAt: Date;
}

export class ArticleLikeStatsDto {
  @ApiProperty({
    description: 'Article ID',
    example: 'cm123456789abcdef',
  })
  articleId: string;

  @ApiProperty({
    description: 'Total number of likes',
    example: 42,
  })
  likesCount: number;

  @ApiPropertyOptional({
    description: 'Whether the current user has liked this article',
    example: true,
  })
  isLikedByUser?: boolean;
}
