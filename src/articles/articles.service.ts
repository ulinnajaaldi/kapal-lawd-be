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
import { SearchArticlesDto } from './dto/search-articles.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../common/dto/pagination.dto';

type ArticleWithCounts = Article & {
  likesCount: number;
  commentsCount: number;
};

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
    searchDto?: SearchArticlesDto,
  ): Promise<PaginatedResponseDto<ArticleWithCounts>> {
    const {
      query,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = searchDto || {};

    const skip = (page - 1) * limit;

    const queryBuilder = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.likes', 'likes')
      .leftJoin('article.comments', 'comments')
      .select(['article', 'author.id', 'author.name', 'author.email'])
      .addSelect('COUNT(DISTINCT likes.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
      .groupBy('article.id')
      .addGroupBy('author.id');

    if (query) {
      queryBuilder.andWhere(
        '(LOWER(article.title) LIKE LOWER(:query) OR LOWER(article.content) LIKE LOWER(:query))',
        { query: `%${query}%` },
      );
    }

    const validSortFields = ['createdAt', 'title', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`article.${sortField}`, sortOrder);

    queryBuilder.skip(skip).take(limit);

    const result = await queryBuilder.getRawAndEntities();
    const articles = result.entities;
    const rawResults = result.raw;

    const articlesWithCounts = articles.map((article, index) => {
      const rawResult = rawResults[index] as {
        likesCount: string;
        commentsCount: string;
      };
      return {
        ...article,
        likesCount: parseInt(rawResult?.likesCount || '0', 10),
        commentsCount: parseInt(rawResult?.commentsCount || '0', 10),
      };
    });

    const totalQueryBuilder = this.articlesRepository
      .createQueryBuilder('article')
      .select('COUNT(article.id)', 'count');

    if (query) {
      totalQueryBuilder.andWhere(
        '(LOWER(article.title) LIKE LOWER(:query) OR LOWER(article.content) LIKE LOWER(:query))',
        { query: `%${query}%` },
      );
    }

    const totalResult = (await totalQueryBuilder.getRawOne()) as {
      count: string;
    };
    const total = parseInt(totalResult?.count || '0', 10);

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(
      articlesWithCounts as ArticleWithCounts[],
      meta,
    );
  }

  async findOne(
    id: string,
    userId?: string,
  ): Promise<Article & { likesCount: number; isLikedByUser?: boolean }> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['author'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
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
  ): Promise<PaginatedResponseDto<ArticleWithCounts>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.articlesRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoin('article.likes', 'likes')
      .leftJoin('article.comments', 'comments')
      .select(['article', 'author.id', 'author.name', 'author.email'])
      .addSelect('COUNT(DISTINCT likes.id)', 'likesCount')
      .addSelect('COUNT(DISTINCT comments.id)', 'commentsCount')
      .where('article.authorId = :authorId', { authorId })
      .groupBy('article.id')
      .addGroupBy('author.id')
      .orderBy('article.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const result = await queryBuilder.getRawAndEntities();
    const articles = result.entities;
    const rawResults = result.raw;

    // Map the counts to the articles
    const articlesWithCounts = articles.map((article, index) => {
      const rawResult = rawResults[index] as {
        likesCount: string;
        commentsCount: string;
      };
      return {
        ...article,
        likesCount: parseInt(rawResult?.likesCount || '0', 10),
        commentsCount: parseInt(rawResult?.commentsCount || '0', 10),
      };
    });

    // Get total count for pagination
    const total = await this.articlesRepository.count({
      where: { authorId },
    });

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(
      articlesWithCounts as ArticleWithCounts[],
      meta,
    );
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
