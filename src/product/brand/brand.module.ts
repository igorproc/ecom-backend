// Node Deps
import { Module } from '@nestjs/common'
// Other Modules
import { AuthModule } from '@/user/auth/auth.module'
import { PrismaModule } from '@/prisma/prisma.module'
import { UploadModule } from '@/upload/upload.module'
// Current Module Deps
import { BrandService } from './brand.service'
import { BrandController } from './brand.controller'

@Module({
  imports: [AuthModule, PrismaModule, UploadModule],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService],
})
export class BrandModule {}
