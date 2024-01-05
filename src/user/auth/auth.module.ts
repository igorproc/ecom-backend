// Node Deps
import { Module } from "@nestjs/common"
// Other Modules
import { JwtModule } from '@nestjs/jwt'
import { PrismaModule } from '@/prisma/prisma.module'
// Current Module Deps
import { AuthService } from '@/user/auth/auth.service'
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Constants
import { TOKEN_LIFETIME, TOKEN_SECRET } from '@/user/auth/const/auth.const'

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: TOKEN_SECRET,
      signOptions: { expiresIn: TOKEN_LIFETIME },
    }),
  ],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
