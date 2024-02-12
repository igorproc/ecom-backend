// Node Deps
import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common'
// Other Services
import { WishlistService } from '@/user/wishlist/wishlist.service'
// Validation DTO
import {
  AddProductToWishlistDto,
  RemoveProductFromWishlistDto
} from '@/user/wishlist/dto/wishlist.dto'

@Controller('user/wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService
  ) {}

  @Get('wishlistData')
  async getWishlistData(
    @Query('wishlistToken') wishlistToken: string
  ) {
    return await this.wishlistService
      .getters
      .getWishlistDataWithProductIds(wishlistToken)
  }

  @Get('wishlistProduct')
  async getWishlistProducts(
    @Query('wishlistToken') wishlistToken: string
  ) {
    return await this.wishlistService
      .getters
      .getWishlistProducts(wishlistToken)
  }

  @Post('create')
  async createWishlist(
    @Req() req: Request
  ) {
    const cookies = req['cookies']
    return await this.wishlistService
      .actions
      .createWishlistCart(cookies['Authorization'])
  }
  @Post('addProduct')
  async addProductToWishlist(
    @Body('productData') productData: AddProductToWishlistDto
  ) {
    return await this.wishlistService
      .actions
      .addProductToWishlistItem(productData)
  }

  @Post('removeProduct')
  async removeProductFromWishlist(
    @Body('productData') productData: RemoveProductFromWishlistDto
  ) {
    return await this
      .wishlistService
      .actions
      .deleteProductFromWishlist(productData)
  }
}
