// Node Deps
import { Module } from '@nestjs/common'
// Others Modules
import { PrismaModule } from '@/prisma/prisma.module'
// Child Modules
import { AuthModule } from "./auth/auth.module"
// Current Modules Deps
import { UserService } from './user.service'
import { UserController } from './user.controller'

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
