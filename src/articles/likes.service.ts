import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Article } from './entities/article.entity';
import { ArticleLikeStatsDto } from './dto/like-response.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async likeArticle(articleId: string, userId: string): Promise<Like> {
    // Check if article exists
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    // Check if user already liked this article
    const existingLike = await this.likesRepository.findOne({
      where: { articleId, userId },
    });

    if (existingLike) {
      throw new ConflictException('Article already liked by user');
    }

    // Create new like
    const like = this.likesRepository.create({
      articleId,
      userId,
    });

    return this.likesRepository.save(like);
  }

  async unlikeArticle(articleId: string, userId: string): Promise<void> {
    // Check if article exists
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    // Find and remove like
    const like = await this.likesRepository.findOne({
      where: { articleId, userId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await this.likesRepository.remove(like);
  }

  async getArticleLikeStats(
    articleId: string,
    userId?: string,
  ): Promise<ArticleLikeStatsDto> {
    // Check if article exists
    const article = await this.articlesRepository.findOne({
      where: { id: articleId },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${articleId} not found`);
    }

    // Get total likes count
    const likesCount = await this.likesRepository.count({
      where: { articleId },
    });

    // Check if current user liked this article (if userId provided)
    let isLikedByUser: boolean | undefined = undefined;
    if (userId) {
      const userLike = await this.likesRepository.findOne({
        where: { articleId, userId },
      });
      isLikedByUser = !!userLike;
    }

    return {
      articleId,
      likesCount,
      isLikedByUser,
    };
  }

  async getUserLikedArticles(
    userId: string,
    paginationDto?: { page?: number; limit?: number },
  ): Promise<{ articles: Article[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    // Get liked articles with pagination
    const [likes, total] = await this.likesRepository.findAndCount({
      where: { userId },
      relations: ['article', 'article.author'],
      select: {
        article: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          author: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const articles = likes.map((like) => like.article);
    return { articles, total };
  }

  async isArticleLikedByUser(
    articleId: string,
    userId: string,
  ): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: { articleId, userId },
    });
    return !!like;
  }
}
