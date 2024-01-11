// Node Deps
import { Module } from '@nestjs/common'
// Current Modules Deps
import { ConfigurableProductService } from '@/product/configurable/configurable.service'
import { ConfigurableProductController } from '@/product/configurable/configurable.controller'
// Other Modules
import { PrismaModule } from '@/prisma/prisma.module'
import { AuthModule } from '@/user/auth/auth.module'

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [ConfigurableProductService],
  exports: [ConfigurableProductService],
  controllers: [ConfigurableProductController],
})
export class ConfigurableProductModule {}
