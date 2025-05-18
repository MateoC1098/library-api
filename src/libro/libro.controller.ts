/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { LibroDto } from './libro.dto/libro.dto';
import { LibroEntity } from './libro.entity/libro.entity';
import { LibroService } from './libro.service';

@Controller('books')
@UseInterceptors(BusinessErrorsInterceptor)
export class LibroController {
  constructor(private readonly libroService: LibroService) {}

  @Get()
  async findAll() {
    return await this.libroService.findAll();
  }

  @Get(':bookId')
  async findOne(@Param('bookId') bookId: string) {
    return await this.libroService.findOne(bookId);
  }

  @Post()
  async create(@Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.create(libro);
  }

  @Put(':bookId')
  async update(@Param('bookId') bookId: string, @Body() libroDto: LibroDto) {
    const libro: LibroEntity = plainToInstance(LibroEntity, libroDto);
    return await this.libroService.update(bookId, libro);
  }

  @Delete(':bookId')
  @HttpCode(204)
  async delete(@Param('bookId') bookId: string) {
    return await this.libroService.delete(bookId);
  }
}
