// Node Deps
import { Module } from '@nestjs/common'
// Child Modules
import { PrismaModule } from '@/prisma/prisma.module'
// Current Modules Deps
import { CartService } from './cart.service'
import { CartController } from './cart.controller'

@Module({
  imports: [PrismaModule],
  providers: [CartService],
  controllers: [CartController]
})
export class CartModule {}
