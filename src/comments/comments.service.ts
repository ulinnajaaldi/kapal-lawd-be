import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from '../articles/entities/article.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../common/dto/pagination.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    authorId: string,
  ): Promise<Comment> {
    // Validate that the article exists
    const article = await this.articlesRepository.findOne({
      where: { id: createCommentDto.articleId },
    });

    if (!article) {
      throw new NotFoundException(
        `Article with ID ${createCommentDto.articleId} not found`,
      );
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      authorId,
    });

    return this.commentsRepository.save(comment);
  }

  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Comment>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const queryBuilder = this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.author', 'author')
      .leftJoinAndSelect('comment.article', 'article')
      .select([
        'comment',
        'author.id',
        'author.name',
        'author.email',
        'article.id',
        'article.title',
      ])
      .orderBy('comment.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    const [comments, total] = await queryBuilder.getManyAndCount();
    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(comments, meta);
  }

  async findByArticle(
    articleId: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Comment>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentsRepository.findAndCount({
      where: { articleId },
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
    return new PaginatedResponseDto(comments, meta);
  }

  async findByAuthor(
    authorId: string,
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResponseDto<Comment>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [comments, total] = await this.commentsRepository.findAndCount({
      where: { authorId },
      relations: ['author', 'article'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
        article: {
          id: true,
          title: true,
        },
      },
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    const meta = new PaginationMetaDto(page, limit, total);
    return new PaginatedResponseDto(comments, meta);
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'article'],
      select: {
        author: {
          id: true,
          name: true,
          email: true,
        },
        article: {
          id: true,
          title: true,
        },
      },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }

    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    userId: string,
  ): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentDto);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, userId: string): Promise<void> {
    const comment = await this.findOne(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
  }

  async countByArticle(articleId: string): Promise<number> {
    return this.commentsRepository.count({ where: { articleId } });
  }

  async countByAuthor(authorId: string): Promise<number> {
    return this.commentsRepository.count({ where: { authorId } });
  }
}
