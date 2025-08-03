import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { ArticlesService } from './articles.service';
import { LikesService } from './likes.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import {
  PaginationDto,
  PaginatedResponseDto,
  PaginationMetaDto,
} from '../common/dto/pagination.dto';

@ApiTags('articles')
@ApiBearerAuth()
@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly likesService: LikesService,
  ) {}

  @ApiOperation({ summary: 'Create a new article' })
  @ApiResponse({ status: 201, description: 'Article created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createArticleDto: CreateArticleDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.articlesService.create(
      createArticleDto,
      user.userId,
    );
    return ApiResponseDto.success(result, 'Article created successfully');
  }

  @ApiOperation({
    summary: 'Get all articles with optional search and filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Articles retrieved successfully',
    type: ArticleResponseDto,
    isArray: true,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'query',
    required: false,
    description:
      'Search query to find articles by title or content (minimum 2 characters)',
    type: String,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max 100)',
    type: Number,
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    description: 'Sort by field',
    enum: ['createdAt', 'title', 'updatedAt'],
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order',
    enum: ['ASC', 'DESC'],
  })
  @Get()
  async findAll(@Query() searchDto: SearchArticlesDto) {
    const result = await this.articlesService.findAll(searchDto);
    return ApiResponseDto.success(result, 'Articles retrieved successfully');
  }

  @ApiOperation({ summary: 'Get article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.articlesService.findOne(id, user.userId);
    return ApiResponseDto.success(result, 'Article retrieved successfully');
  }

  @ApiOperation({ summary: 'Update article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateArticleDto: UpdateArticleDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.articlesService.update(
      id,
      updateArticleDto,
      user.userId,
    );
    return ApiResponseDto.success(result, 'Article updated successfully');
  }

  @ApiOperation({ summary: 'Delete article' })
  @ApiResponse({ status: 204, description: 'Article deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not the author' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiParam({ name: 'id', description: 'Article ID' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    await this.articlesService.remove(id, user.userId);
    return ApiResponseDto.success(null, 'Article deleted successfully');
  }

  @ApiOperation({ summary: 'Get current user articles' })
  @ApiResponse({
    status: 200,
    description: 'User articles retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max 100)',
    type: Number,
  })
  @Get('my/articles')
  async findMyArticles(
    @CurrentUser() user: { userId: string; email: string },
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.articlesService.findByAuthor(
      user.userId,
      paginationDto,
    );
    return ApiResponseDto.success(
      result,
      'User articles retrieved successfully',
    );
  }

  @ApiOperation({ summary: 'Like an article' })
  @ApiResponse({ status: 201, description: 'Article liked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiResponse({ status: 409, description: 'Article already liked' })
  @Post(':id/like')
  @HttpCode(HttpStatus.CREATED)
  async likeArticle(
    @Param('id') articleId: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.likesService.likeArticle(articleId, user.userId);
    return ApiResponseDto.success(result, 'Article liked successfully');
  }

  @ApiOperation({ summary: 'Unlike an article' })
  @ApiResponse({ status: 204, description: 'Article unliked successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article or like not found' })
  @Delete(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT)
  async unlikeArticle(
    @Param('id') articleId: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    await this.likesService.unlikeArticle(articleId, user.userId);
    return ApiResponseDto.success(null, 'Article unliked successfully');
  }

  @ApiOperation({ summary: 'Get article like statistics' })
  @ApiResponse({
    status: 200,
    description: 'Article like stats retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @Get(':id/likes')
  async getArticleLikeStats(
    @Param('id') articleId: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.likesService.getArticleLikeStats(
      articleId,
      user.userId,
    );
    return ApiResponseDto.success(
      result,
      'Article like stats retrieved successfully',
    );
  }

  @ApiOperation({ summary: 'Get user liked articles' })
  @ApiResponse({
    status: 200,
    description: 'User liked articles retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number (1-based)',
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page (max 100)',
    type: Number,
  })
  @Get('my/liked')
  async getUserLikedArticles(
    @CurrentUser() user: { userId: string; email: string },
    @Query() paginationDto: PaginationDto,
  ) {
    const { articles, total } = await this.likesService.getUserLikedArticles(
      user.userId,
      paginationDto,
    );
    const meta = new PaginationMetaDto(
      paginationDto.page || 1,
      paginationDto.limit || 10,
      total,
    );
    const result = new PaginatedResponseDto(articles, meta);
    return ApiResponseDto.success(
      result,
      'User liked articles retrieved successfully',
    );
  }
}
