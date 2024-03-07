// Node Deps
import { Module } from '@nestjs/common'
// Other Modules
import { PrismaModule } from '@/prisma/prisma.module'
import { AuthModule } from '@/user/auth/auth.module'
// Current Modules Deps
import {
  productAdditionalDataService
} from '@/product/additionalData/productAddtitionalData.service'
import {
  productAdditionalDataController
} from '@/product/additionalData/productAdditionalData.controller'

@Module({
  imports: [PrismaModule, AuthModule],
  exports: [productAdditionalDataService],
  providers: [productAdditionalDataService],
  controllers: [productAdditionalDataController]
})
export class productAdditionalDataModule {}
