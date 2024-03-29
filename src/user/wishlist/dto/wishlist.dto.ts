import { IsNumber, IsOptional, IsUUID } from 'class-validator'

export class AddProductToWishlistDto {
  @IsUUID()
  wishlistToken: string

  @IsNumber()
  productId: number

  @IsOptional()
  @IsNumber()
  variantId: number
}

export class RemoveProductFromWishlistDto {
  @IsUUID()
  wishlistToken: string

  @IsNumber()
  wishlistItemId: number
}
