import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { LikesService } from './likes.service';
import { Article } from './entities/article.entity';
import { Like } from './entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Like])],
  controllers: [ArticlesController],
  providers: [ArticlesService, LikesService],
  exports: [ArticlesService, LikesService],
})
export class ArticlesModule {}
