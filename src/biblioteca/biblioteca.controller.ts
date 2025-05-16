/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaDto } from './biblioteca.dto/biblioteca.dto';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaController {
  constructor(private readonly bibliotecaService: BibliotecaService) {}

  @Get()
  async findAll() {
    return await this.bibliotecaService.findAll();
  }

  @Get(':libraryId')
  async findOne(@Param('libraryId') libraryId: string) {
    return await this.bibliotecaService.findOne(libraryId);
  }

  @Post()
  async create(@Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
    return await this.bibliotecaService.create(biblioteca);
  }

  @Put(':libraryId')
  async update(@Param('libraryId') libraryId: string, @Body() bibliotecaDto: BibliotecaDto) {
    const biblioteca: BibliotecaEntity = plainToInstance(BibliotecaEntity, bibliotecaDto);
    return await this.bibliotecaService.update(libraryId, biblioteca);
  }

  @Delete(':libraryId')
  @HttpCode(204)
  async delete(@Param('libraryId') libraryId: string) {
    return await this.bibliotecaService.delete(libraryId);
  }
}