/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibroEntity } from './libro.entity/libro.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class LibroService {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>
  ) {}

  async findAll(): Promise<LibroEntity[]> {
    return await this.libroRepository.find({ relations: ['bibliotecas'] });
  }

  async findOne(id: string): Promise<LibroEntity> {
    const libro = await this.libroRepository.findOne({ where: { id }, relations: ['bibliotecas'] });
    if (!libro) throw new BusinessLogicException('No se encontro el libro con el id dado', BusinessError.NOT_FOUND);
    return libro;
  }

  async create(libro: LibroEntity): Promise<LibroEntity> {
    const hoy = new Date().toISOString().split('T')[0];
    const fechaLibro = new Date(libro.fechaPublicacion).toISOString().split('T')[0];
    
    if (fechaLibro > hoy)
      throw new BusinessLogicException('La fecha de publicación no puede ser posterior a la fecha actual', BusinessError.PRECONDITION_FAILED);
    return await this.libroRepository.save(libro);
  }

  async update(id: string, libro: LibroEntity): Promise<LibroEntity> {
    const existing = await this.libroRepository.findOne({ where: { id } });
    if (!existing)
      throw new BusinessLogicException('No se encontro el libro con el id dado', BusinessError.NOT_FOUND);

    const hoy = new Date().toISOString().split('T')[0];
    const fechaLibro = new Date(libro.fechaPublicacion).toISOString().split('T')[0];
    if (fechaLibro > hoy)
      throw new BusinessLogicException('La fecha de publicación no puede ser posterior a la fecha actual', BusinessError.PRECONDITION_FAILED);
    
    return await this.libroRepository.save({ ...existing, ...libro });
  }

  async delete(id: string) {
    const libro = await this.libroRepository.findOne({ where: { id } });
    if (!libro)
      throw new BusinessLogicException('The book with the given id was not found', BusinessError.NOT_FOUND);
    await this.libroRepository.remove(libro);
  }
}
