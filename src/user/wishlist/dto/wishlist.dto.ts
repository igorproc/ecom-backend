import { IsNumber, IsString, IsOptional, IsUUID } from 'class-validator'

export class AddProductToWishlistDto {
  @IsString()
  wishlistToken: string

  @IsNumber()
  productId: number

  @IsOptional()
  @IsNumber()
  variantId: number
}
