/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibliotecaEntity } from './biblioteca.entity/biblioteca.entity';
import { BibliotecaService } from './biblioteca.service';

@Module({
  imports: [TypeOrmModule.forFeature([BibliotecaEntity])],
  providers: [BibliotecaService],
  exports: [BibliotecaService]
})
export class BibliotecaModule {}
