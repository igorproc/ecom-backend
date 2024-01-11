// Node Deps
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
// Other Services
import { AuthService } from '@/user/auth/auth.service'
// Decorators
import { Roles } from '@/user/auth/decorators.roles'
// Utils
import { getCookieFromRaw } from '@utils/getHeader.util'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly auth: AuthService
  ) {}
  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler())
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
    if (!roles || !roles.length) {
      return true
    }

    const tokenPayload = this.auth.getters.getTokenData(authToken)
    console.log(tokenPayload.role.toLowerCase(), roles)
    if (!roles.includes(tokenPayload.role.toLowerCase())) {
      throw new UnauthorizedException()
    }
    return true
  }
}
