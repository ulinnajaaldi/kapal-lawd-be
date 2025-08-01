import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponseDto } from './common/dto/api-response.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    const message = this.appService.getHello();
    return ApiResponseDto.success(
      message,
      'Welcome to Kapal Lawd Articles API',
    );
  }
}
