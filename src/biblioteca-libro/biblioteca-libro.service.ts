/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LibroEntity } from '../libro/libro.entity/libro.entity';
import { BibliotecaEntity } from '../biblioteca/biblioteca.entity/biblioteca.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';

@Injectable()
export class BibliotecaLibroService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>,

    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async addBookToLibrary(bibliotecaId: string, libroId: string): Promise<BibliotecaEntity> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException('El libro con el id dado no fue encontrado', BusinessError.NOT_FOUND);

    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca)
      throw new BusinessLogicException('La biblioteca con el id dado no fue encontrada', BusinessError.NOT_FOUND);

    biblioteca.libros = [...biblioteca.libros, libro];
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async findBookFromLibrary(bibliotecaId: string, libroId: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException('El libro con el id dado no fue encontrado', BusinessError.NOT_FOUND);

    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca)
      throw new BusinessLogicException('La biblioteca con el id dado no fue encontrada', BusinessError.NOT_FOUND);

    const libroEnBiblioteca = biblioteca.libros.find((lib) => lib.id === libro.id);
    if (!libroEnBiblioteca)
      throw new BusinessLogicException('El libro con el id dado no está asociado a la biblioteca', BusinessError.PRECONDITION_FAILED);

    return libroEnBiblioteca;
  }

  async findBooksFromLibrary(bibliotecaId: string): Promise<LibroEntity[]> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca)
      throw new BusinessLogicException('La biblioteca con el id dado no fue encontrada', BusinessError.NOT_FOUND);

    return biblioteca.libros;
  }

  async associateBooksToLibrary(bibliotecaId: string, libros: LibroEntity[]): Promise<BibliotecaEntity> {
  const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
  if (!biblioteca)
    throw new BusinessLogicException('La biblioteca con el id dado no fue encontrada', BusinessError.NOT_FOUND);

  const librosActualizados: LibroEntity[] = [];

  for (const libro of libros) {
    const libroExistente = await this.libroRepository.findOne({ where: { id: libro.id } });
    if (!libroExistente)
      throw new BusinessLogicException(`El libro con id ${libro.id} no fue encontrado`, BusinessError.NOT_FOUND);

    libroExistente.titulo = libro.titulo;
    libroExistente.autor = libro.autor;
    libroExistente.fechaPublicacion = libro.fechaPublicacion;
    libroExistente.isbn = libro.isbn;

    await this.libroRepository.save(libroExistente);
    librosActualizados.push(libroExistente);
  }

  biblioteca.libros = librosActualizados;
  return await this.bibliotecaRepository.save(biblioteca);
}

  async deleteBookFromLibrary(bibliotecaId: string, libroId: string): Promise<void> {
    const libro = await this.libroRepository.findOne({ where: { id: libroId } });
    if (!libro)
      throw new BusinessLogicException('El libro con el id dado no fue encontrado', BusinessError.NOT_FOUND);

    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id: bibliotecaId }, relations: ['libros'] });
    if (!biblioteca)
      throw new BusinessLogicException('La biblioteca con el id dado no fue encontrada', BusinessError.NOT_FOUND);

    const libroEnBiblioteca = biblioteca.libros.find((lib) => lib.id === libro.id);
    if (!libroEnBiblioteca)
      throw new BusinessLogicException('El libro con el id dado no está asociado a la biblioteca', BusinessError.PRECONDITION_FAILED);

    biblioteca.libros = biblioteca.libros.filter((lib) => lib.id !== libroId);
    await this.bibliotecaRepository.save(biblioteca);
  }
}
