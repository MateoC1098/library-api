/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class BibliotecaService {
  constructor(
    @InjectRepository(BibliotecaEntity)
    private readonly bibliotecaRepository: Repository<BibliotecaEntity>
  ) {}

  async findAll(): Promise<BibliotecaEntity[]> {
    return await this.bibliotecaRepository.find({ relations: ['libros'] });
  }

  async findOne(id: string): Promise<BibliotecaEntity> {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id }, relations: ['libros'] });
    if (!biblioteca) 
        throw new BusinessLogicException('No se encontró la biblioteca con el id dado', BusinessError.NOT_FOUND);
    return biblioteca;
  }

  async create(biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    const [horaApertura, horaCierre] = biblioteca.horarioAtencion.split('-');
    if (horaApertura >= horaCierre)
      throw new BusinessLogicException('La hora de apertura debe ser anterior a la hora de cierre', BusinessError.PRECONDITION_FAILED);
    return await this.bibliotecaRepository.save(biblioteca);
  }

  async update(id: string, biblioteca: BibliotecaEntity): Promise<BibliotecaEntity> {
    const persistedLibrary = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!persistedLibrary)
      throw new BusinessLogicException('No se encontró la biblioteca con el id dado', BusinessError.NOT_FOUND);
    
    const [horaApertura, horaCierre] = biblioteca.horarioAtencion.split('-');
    if (horaApertura >= horaCierre)
      throw new BusinessLogicException('La hora de apertura debe ser anterior a la hora de cierre', BusinessError.PRECONDITION_FAILED);
    
    return await this.bibliotecaRepository.save({ ...persistedLibrary, ...biblioteca });
  }

  async delete(id: string) {
    const biblioteca = await this.bibliotecaRepository.findOne({ where: { id } });
    if (!biblioteca)
      throw new BusinessLogicException('No se encontró la biblioteca con el id dado', BusinessError.NOT_FOUND);
    await this.bibliotecaRepository.remove(biblioteca);
  }
}
