import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        message =
          (responseObj.message as string) ||
          (responseObj.error as string) ||
          'An error occurred';

        // Handle validation errors
        if (Array.isArray(responseObj.message)) {
          message = (responseObj.message as string[]).join(', ');
        }
      } else {
        message = 'An error occurred';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      // Log the actual error for debugging
      console.error('Unhandled exception:', exception);
      if (exception instanceof Error) {
        console.error('Error stack:', exception.stack);
        console.error('Error message:', exception.message);
      }
    }

    const errorResponse = ApiResponseDto.error(message);

    response.status(status).json(errorResponse);
  }
}
