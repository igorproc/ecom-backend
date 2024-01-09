import { IsNumber, IsOptional, IsString } from 'class-validator'

export class AddOptionGroupDto {
  @IsNumber()
  productId: number

  @IsString()
  label: string
}

export class AddItemToOptionGroupDto {
  @IsNumber()
  optionGroupId: number

  @IsString()
  label: string

  @IsString()
  value: string
}

export class AddVariantGroupDto {
  @IsNumber()
  productId: number

  @IsString()
  sku: string

  @IsOptional()
  @IsString()
  imageUrl?: string
}

export class AddItemToVariantGroupDto {
  @IsNumber()
  variantGroupId: number

  @IsNumber()
  optionGroupId: number

  @IsNumber()
  optionItemId: number
}
