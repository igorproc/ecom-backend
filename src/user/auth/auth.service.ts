// Node Deps
import { Injectable } from "@nestjs/common"
// Prisma Models
import { user } from '@prisma/client'
// Other Services
import { JwtService } from "@nestjs/jwt"
import { PrismaService } from '@/prisma/prisma.service'
import { TOKEN_SECRET } from '@/user/auth/const/auth.const'
// Types & Interfaces
import { TUserJwtPayload } from '@/user/user.types'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  protected readonly validation = {
    validateJWTToken: (token: string) => {
      try {
        return this.jwt.verify(token, { secret: TOKEN_SECRET }) as TUserJwtPayload
      } catch (error) {
        throw error
      }
    },
  }
  public readonly getters = {
    checkTokenIsAlive: async (token: string) => {
      try {
        const tokenData = this.validation.validateJWTToken(token)
        if (!tokenData) {
          return {
            error: { code: 501, message: 'invalid JWT token' }
          }
        }

        const tokenLifetime = await this.prisma
          .apiTokens
          .findUnique({
            where: { token, user_id: tokenData.uid },
          })
        if (!tokenLifetime) {
          return { isValid: false }
        }

        if (Date.now() >= tokenLifetime.expires_at.getTime()) {
          return { isValid: false }
        }
        return { isValid: true }
      } catch (error) {
        throw error
      }
    },
    getTokenData: (token: string) => {
      return this.validation.validateJWTToken(token)
    },
  }
  public readonly actions = {
    signIn: async (user: user) => {
      try {
        const accessToken = await this.jwt.signAsync({
          uid: user.uid,
          email: user.email,
          role: user.role,
        })
        const expiresDate = new Date()
        expiresDate.setDate(new Date().getDate() + 14)

        const tokenRecordIsCreated = await this.prisma
          .apiTokens
          .create({
            data: {
              user_id: user.uid,
              name: 'JWT token',
              type: 'api',
              token: accessToken,
              expires_at: expiresDate
            }
          })

        if (!tokenRecordIsCreated || !accessToken) {
          return null
        }
        return accessToken
      } catch (error) {
        throw error
      }
    },
    signOut: async (token: string) => {
      try {
        if (!this.validation.validateJWTToken(token)) {
          return null
        }

        const tokenIsDeleted = await this.prisma
          .apiTokens
          .delete({
            where: { token }
          })
        if (!tokenIsDeleted) {
          return { isSignOut: false }
        }
        return { isSignOut: true }
      } catch (error) {
        throw error
      }
    }
  }
}
