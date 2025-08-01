import { PaginatedResponseDto } from './pagination.dto';

export class ApiResponseDto<T> {
  status: 'ok' | 'error';
  message: string;
  data: T | T[] | PaginatedResponseDto<T> | null;

  constructor(
    status: 'ok' | 'error',
    message: string,
    data: T | T[] | PaginatedResponseDto<T> | null = null,
  ) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    data: T | T[] | PaginatedResponseDto<T>,
    message: string = 'Success',
  ): ApiResponseDto<T> {
    return new ApiResponseDto<T>('ok', message, data);
  }

  static error<T>(
    message: string,
    data: T | T[] | null = null,
  ): ApiResponseDto<T> {
    return new ApiResponseDto<T>('error', message, data);
  }
}
