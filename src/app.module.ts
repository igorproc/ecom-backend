// Node Deps
import { Module } from '@nestjs/common'
// Util Modules
import { ConfigModule } from '@nestjs/config'
// Root Modules
import { UserModule } from '@/user/user.module'
import { ProductModule } from './product/product.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ProductModule,
  ],
})
export class AppModule {}
