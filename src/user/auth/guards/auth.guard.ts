// Node Deps
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
// Other Services
import { AuthService } from '@/user/auth/auth.service'
// Utils
import { getCookieFromRaw } from '@utils/getHeader.util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService
  ) {}
  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const headers = req['headers']
    if (!headers) {
      throw new UnauthorizedException()
    }

    const authToken = getCookieFromRaw(headers.cookie, 'Authorization')
    if (!authToken) {
      throw new UnauthorizedException()
    }

    const isValidToken = await this.auth
      .getters
      .checkTokenIsAlive(authToken)
    if (!isValidToken.isValid || isValidToken.error) {
      throw new UnauthorizedException()
    }

    return true
  }
}
