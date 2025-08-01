import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Like } from './entities/like.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../common/dto/pagination.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
  ) {}

  async create(
    createArticleDto: CreateArticleDto,
    authorId: string,
  ): Promise<Article> {
    const article = this.articlesRepository.create({
      ...createArticleDto,
      authorId,
    });

    return this.articlesRepository.save(article);
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Article>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [articles, total] = await this.articlesRepository.findAndCount({
      relations: ['author'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(articles, meta);
  }

  async findOne(
    id: string,
    userId?: string,
  ): Promise<Article & { likesCount: number; isLikedByUser?: boolean }> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
        comments: {
          id: true,
          content: true,
          createdAt: true,
          authorId: true,
        },
      },
    });

    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }

    // Get likes count
    const likesCount = await this.likesRepository.count({
      where: { articleId: id },
    });

    // Check if current user liked this article (if userId provided)
    let isLikedByUser: boolean | undefined = undefined;
    if (userId) {
      const userLike = await this.likesRepository.findOne({
        where: { articleId: id, userId },
      });
      isLikedByUser = !!userLike;
    }

    return Object.assign(article, {
      likesCount,
      isLikedByUser,
    });
  }

  async findByAuthor(
    authorId: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Article>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [articles, total] = await this.articlesRepository.findAndCount({
      where: { authorId },
      relations: ['author'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(articles, meta);
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
  ): Promise<Article> {
    const article = await this.findOne(id);

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only update your own articles');
    }

    Object.assign(article, updateArticleDto);
    return this.articlesRepository.save(article);
  }

  async remove(id: string, userId: string): Promise<void> {
    const article = await this.findOne(id);

    if (article.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    await this.articlesRepository.remove(article);
  }
}
