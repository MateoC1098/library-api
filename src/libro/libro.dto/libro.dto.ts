/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from "class-validator";

export class LibroDto {
    @IsString()
    @IsNotEmpty()
    readonly titulo: string;

    @IsString()
    @IsNotEmpty()
    readonly autor: number;

    @IsString()
    @IsNotEmpty()
    readonly fechaPublicacion: string;

    @IsString()
    @IsNotEmpty()
    readonly isbn: string;
}
