import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Article ID',
    example: 'clx1y2z3a4b5c6d7e8f9g0h1',
  })
  id: string;

  @ApiProperty({
    description: 'Article title',
    example: 'Getting Started with TypeScript',
  })
  title: string;

  @ApiProperty({
    description: 'Article content',
    example: 'TypeScript is a powerful programming language...',
  })
  content: string;

  @ApiProperty({
    description: 'Author ID',
    example: 'author_id_123',
  })
  authorId: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2025-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Number of likes on this article',
    example: 15,
  })
  likesCount: number;

  @ApiProperty({
    description: 'Number of comments on this article',
    example: 8,
  })
  commentsCount: number;

  @ApiPropertyOptional({
    description: 'Author information',
  })
  author?: {
    id: string;
    name: string;
    email: string;
  };
}
