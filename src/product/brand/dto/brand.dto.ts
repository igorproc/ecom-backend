// Node Deps
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator'

export enum EBrandFilterDirection {
  'asc' = 'asc',
  'desc' = 'desc',
}

class BrandListFilters {
  @IsEnum(EBrandFilterDirection)
  direction: EBrandFilterDirection
}
export class GetBrandList {
  @IsNumber()
  page: number

  @IsNumber()
  size: number

  @IsOptional()
  filters: BrandListFilters
}

export class CreateBrandDto {
  @IsString()
  name: string

  @IsString()
  imageUrl: string
}
