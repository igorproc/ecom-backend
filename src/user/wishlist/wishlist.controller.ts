// Node Deps
import { Body, Controller, Get, Post, Req } from '@nestjs/common'
// Other Services
import { WishlistService } from '@/user/wishlist/wishlist.service'
// Validation DTO
import {
  AddProductToWishlistDto,
} from '@/user/wishlist/dto/wishlist.dto'

@Controller('user/wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService
  ) {}

  @Get('wishlistData')
  async getWishlistData(
    @Req() req: Request
  ) {
    const cookies = req['cookies']
    return await this.wishlistService
      .getters
      .getWishlistDataWithProductIds(cookies['wishlist-id'])
  }

  @Get('wishlistProduct')
  async getWishlistProducts(
    @Req() req: Request
  ) {
    const cookies = req['cookies']
    return await this.wishlistService
      .getters
      .getWishlistProducts(cookies['wishlist-id'])
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
    @Body('productData') productData: AddProductToWishlistDto
  ) {
    return await this
      .wishlistService
      .actions
      .deleteProductFromWishlist(productData)
  }
}
