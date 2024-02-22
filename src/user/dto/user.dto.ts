// Node Deps
import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator'
// Types & Interfaces
import { TUserRoles } from '@/user/user.types'

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsNumber()
  birthday: string

  @IsOptional()
  @IsString()
  role?: TUserRoles
}

export class LoginUserDto {
  @IsEmail()
  email: string

  @IsString()
  password: string
}
