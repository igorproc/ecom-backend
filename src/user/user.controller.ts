// Node Deps
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
// Services
import { UserService } from '@/user/user.service'
import { AuthService } from '@/user/auth/auth.service'
// Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Types & Interfaces
import {
  TUserCreateInput,
  TUserLoginInput,
} from '@/user/user.types'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('getUserData')
  @UseGuards(AuthGuard)
  async getUserById(
    @Query('id') id: string
  ) {
    if (!id) {
      return {
        error: {code: 1, message: 'no required fields are send'}
      }
    }

    return await this.userService.getters.getUserById(Number(id))
  }

  @Get('checkAuthStatus')
  async checkAuthStatus(
    @Query('token') userToken: string
  ) {
    if (!userToken) {
      return {
        error: {code: 501, message: 'no required fields are send'}
      }
    }
    return await this.authService
      .getters
      .checkTokenIsAlive(userToken)
  }

  @Post('create')
  async createUser(
    @Body() createData?: TUserCreateInput
  ) {
    if (!createData) {
      return {
        error: {code: 1, message: 'no required fields are send'}
      }
    }

    return await this.userService.actions.createUser(createData)
  }

  @Post('login')
  async loginUser(
    @Body() loginData?: TUserLoginInput
  ) {
    if (!loginData) {
      return {
        error: {code: 1, message: 'no required fields are send'}
      }
    }

    return await this.userService.actions.loginUser(loginData)
  }

  @Post('logout')
  async logoutUser(
    @Query('token') token: string
  ) {
    if (!token) {
      return {
        error: { code: 501, message: 'Incorrect token' }
      }
    }

    return this.authService.actions.signOut(token)
  }
}
