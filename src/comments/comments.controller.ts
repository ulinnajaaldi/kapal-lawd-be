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
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('comments')
@ApiBearerAuth()
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create a new comment' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.commentsService.create(
      createCommentDto,
      user.userId,
    );
    return ApiResponseDto.success(result, 'Comment created successfully');
  }

  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully' })
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
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.commentsService.findAll(paginationDto);
    return ApiResponseDto.success(result, 'Comments retrieved successfully');
  }

  @ApiOperation({ summary: 'Get comments by article' })
  @ApiResponse({
    status: 200,
    description: 'Article comments retrieved successfully',
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
  @Get('article/:articleId')
  async findByArticle(
    @Param('articleId') articleId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.commentsService.findByArticle(
      articleId,
      paginationDto,
    );
    return ApiResponseDto.success(
      result,
      'Article comments retrieved successfully',
    );
  }

  @ApiOperation({ summary: 'Get current user comments' })
  @ApiResponse({
    status: 200,
    description: 'User comments retrieved successfully',
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
  @Get('my')
  async findMyComments(
    @CurrentUser() user: { userId: string; email: string },
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.commentsService.findByAuthor(
      user.userId,
      paginationDto,
    );
    return ApiResponseDto.success(
      result,
      'User comments retrieved successfully',
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.commentsService.findOne(id);
    return ApiResponseDto.success(result, 'Comment retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    const result = await this.commentsService.update(
      id,
      updateCommentDto,
      user.userId,
    );
    return ApiResponseDto.success(result, 'Comment updated successfully');
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: { userId: string; email: string },
  ) {
    await this.commentsService.remove(id, user.userId);
    return ApiResponseDto.success(null, 'Comment deleted successfully');
  }
}
