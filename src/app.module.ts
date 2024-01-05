// Node Deps
import { Module } from '@nestjs/common'
// Root Modules
import { UserModule } from '@/user/user.module'

@Module({
  imports: [UserModule],
})
export class AppModule {}
