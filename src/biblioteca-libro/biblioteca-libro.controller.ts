/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { LibroDto } from '../libro/libro.dto/libro.dto';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BibliotecaLibroService } from './biblioteca-libro.service';

@Controller('libraries')
@UseInterceptors(BusinessErrorsInterceptor)
export class BibliotecaLibroController {
  constructor(
    private readonly bibliotecaLibroService: BibliotecaLibroService,
  ) {}

  @Post(':libraryId/books/:bookId')
  async addBookToLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return await this.bibliotecaLibroService.addBookToLibrary(
      libraryId,
      bookId,
    );
  }

  @Get(':libraryId/books')
  async findBooksFromLibrary(@Param('libraryId') libraryId: string) {
    return await this.bibliotecaLibroService.findBooksFromLibrary(libraryId);
  }

  @Get(':libraryId/books/:bookId')
  async findBookFromLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return await this.bibliotecaLibroService.findBookFromLibrary(
      libraryId,
      bookId,
    );
  }

  @Put(':libraryId/books')
  async updateBooksFromLibrary(
    @Param('libraryId') libraryId: string,
    @Body() librosDto: LibroDto[],
  ) {
    const libros = plainToInstance(LibroEntity, librosDto);
    return await this.bibliotecaLibroService.associateBooksToLibrary(
      libraryId,
      libros,
    );
  }

  @Delete(':libraryId/books/:bookId')
  @HttpCode(204)
  async deleteBookFromLibrary(
    @Param('libraryId') libraryId: string,
    @Param('bookId') bookId: string,
  ) {
    return await this.bibliotecaLibroService.deleteBookFromLibrary(
      libraryId,
      bookId,
    );
  }
}

