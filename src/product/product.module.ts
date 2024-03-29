// Node Deps
import { Module } from '@nestjs/common'
// Others Modules
import { AuthModule } from '@/user/auth/auth.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UploadModule } from '@/upload/upload.module'
// Child Modules
import { ConfigurableProductModule } from '@/product/configurable/configurable.module'
import { BrandModule } from './brand/brand.module'
// Current Modules Deps
import { ProductService } from '@/product/product.service'
import { ProductController } from '@/product/product.controller'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    ConfigurableProductModule,
    UploadModule,
    BrandModule,
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService]
})
export class ProductModule {}
