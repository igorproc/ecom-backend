// Node Deps
import { Module } from '@nestjs/common'
// Others Modules
import { PrismaModule } from '@/prisma/prisma.module'
// Child Modules
import { AuthModule } from "./auth/auth.module"
import { WishlistModule } from './wishlist/wishlist.module'
import { CartModule } from './cart/cart.module'
// Current Modules Deps
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    WishlistModule,
    CartModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
