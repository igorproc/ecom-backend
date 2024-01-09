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
// Validation DTO
import { CreateUserDto, LoginUserDto } from '@/user/dto/user.dto'

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get('getUserData')
  @UseGuards(AuthGuard)
  async getUserById(
    @Query('token') token: string
  ) {
    if (!token) {
      return {
        error: {code: 1, message: 'no required fields are send'}
      }
    }

    return await this.userService.getters.getUserData(token)
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
    @Body('createUserData') createData?: CreateUserDto
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
    @Body('userData') loginData?: LoginUserDto
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
