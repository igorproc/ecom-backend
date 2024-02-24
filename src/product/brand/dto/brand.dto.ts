// Node Deps
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator'

export enum EBrandFilterDirection {
  'asc' = 'asc',
  'desc' = 'desc',
}

export class GetBrandList {
  @IsNumber()
  page: number

  @IsNumber()
  size: number

  @IsOptional()
  @IsEnum(EBrandFilterDirection)
  direction?: EBrandFilterDirection
}

export class CreateBrandDto {
  @IsString()
  name: string

  @IsString()
  imageUrl: string
}
