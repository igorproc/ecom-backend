// Node Deps
import { Module } from '@nestjs/common'
// Others Modules
import { PrismaModule } from '@/prisma/prisma.module'
import { AuthModule } from '@/user/auth/auth.module'
// Current Modules Deps
import { WishlistService } from './wishlist.service'
import { WishlistController } from './wishlist.controller'
import { ProductModule } from '@/product/product.module'

@Module({
  imports: [PrismaModule, AuthModule, ProductModule],
  providers: [WishlistService],
  exports: [WishlistService],
  controllers: [WishlistController]
})
export class WishlistModule {}
