// Node Deps
import { Injectable } from '@nestjs/common'
import { compareSync, hashSync } from 'bcrypt'
import { v4 as generateUUID } from 'uuid'
// Child Services
import { AuthService } from '@/user/auth/auth.service'
import { WishlistService } from '@/user/wishlist/wishlist.service'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Types & Interfaces
import { EUserRoles, TUserCreate } from '@/user/user.types'
import { TResponseError } from '@/types/global.types'
// Validation DTO
import type {
  CreateUserDto as TUserCreateInput,
  LoginUserDto as TUserLoginInput
} from '@/user/dto/user.dto'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly wishlist: WishlistService,
  ) {}

  protected readonly validation = {
    checkEmailIsExists: async (email: string) => {
      try {
        return await this.prisma
          .user
          .findFirst({
            where: { email }
          })
      } catch (error) {
        throw error
      }
    },
  }
  public readonly getters = {
    getUserData: async (token: string) => {
      try {
        const tokenPayload = this.auth.getters.getTokenData(token)
        if (!tokenPayload) {
          return { code: { error: 500, message: 'Unhorized' } }
        }

        return await this.prisma
          .user
          .findUnique({
            where: { email: tokenPayload.email },
            select: {
              uid: true,
              email: true,
              role: true,
              birthday: true
            }
          })
      } catch (error) {
        throw error
      }
    },
  }
  public readonly actions = {
    createUser: async (userData: TUserCreateInput, guestWishlistToken: string): Promise<TUserCreate | TResponseError> => {
      try {
        const userEmailIsExists = await this.validation.checkEmailIsExists(userData.email)
        if (userEmailIsExists) {
          return {
            error: { code: 501, message: 'User with this email is exists' }
          }
        }

        const createdData = await this.prisma
          .user
          .create({
            data: {
              email: userData.email,
              password: hashSync(userData.password, 10),
              birthday: new Date(userData.birthday),
              role: EUserRoles[userData.role] || EUserRoles.user
            }
          })
        if (!createdData) {
          return {
            error: { code: 501, message: 'User can\t create at now' }
          }
        }

        const userSecret = await this.auth.actions.signIn(createdData)
        if (!userSecret) {
          return {
            error: { code: 500, message: 'Create JWT Error' }
          }
        }

       const wishlistToken = await this.wishlist
          .actions
          .reassignWishlist({
            guestWishlistToken: guestWishlistToken,
            userWishlistToken: generateUUID(),
          })

        return {
          userData: createdData,
          token: userSecret,
          wishlistToken: wishlistToken,
        }
      } catch (error) {
        throw error
      }
    },
    loginUser: async (userData: TUserLoginInput, guestWishlistToken: string): Promise<TUserCreate | TResponseError> => {
      try {
        const userCandidate = await this.validation.checkEmailIsExists(userData.email)
        if (!userCandidate) {
          return {
            error: { code: 501, message: 'Invalid email or password' },
          }
        }

        const passwordIsCorrect = compareSync(userData.password, userCandidate.password)
        if (!passwordIsCorrect) {
          return {
            error: { code: 501, message: 'Invalid email or password' },
          }
        }

        const userSecret = await this.auth.actions.signIn(userCandidate)
        const wishlistToken = await this.wishlist
          .actions
          .assignWishlist({ authToken: userSecret, guestWishlistToken })

        if (typeof wishlistToken === 'object' && 'error' in wishlistToken) {
          return wishlistToken
        }

        return {
          userData: userCandidate,
          token: userSecret,
          wishlistToken: wishlistToken,
        }
      } catch (error) {
        throw error
      }
    },
  }
}
