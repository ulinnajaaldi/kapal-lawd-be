import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class UpdateCommentDto {
  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  @MinLength(1, { message: 'Content must be at least 1 character long' })
  @MaxLength(1000, { message: 'Content must not exceed 1000 characters' })
  content?: string;

  // Note: We don't allow updating articleId to prevent moving comments between articles
  // This is handled in the service layer with validation
}
