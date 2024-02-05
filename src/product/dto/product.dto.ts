// Node Deps
import { IsOptional, IsNumber, IsString } from 'class-validator'
// Types & Interfaces
import { EAddProductTypes } from '@/product/product.types'

export class GetProductListDto {
  @IsNumber()
  page: number

  @IsOptional()
  @IsNumber()
  count?: number
}

export class CreateProductDto {
  @IsString()
  name: string

  @IsNumber()
  price: number

  @IsString()
  type: keyof typeof EAddProductTypes

  @IsOptional()
  @IsString()
  productImage: string
}

export class EditProductDto {
  @IsNumber()
  productId: number

  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  price?: number

  @IsOptional()
  @IsString()
  type?: EAddProductTypes
}
