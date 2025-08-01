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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    const result = await this.usersService.create(createUserDto);
    return ApiResponseDto.success(result, 'User created successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const result = await this.usersService.findAll();
    return ApiResponseDto.success(result, 'Users retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.usersService.findOne(id);
    return ApiResponseDto.success(result, 'User retrieved successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.update(id, updateUserDto);
    return ApiResponseDto.success(result, 'User updated successfully');
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return ApiResponseDto.success(null, 'User deleted successfully');
  }
}
