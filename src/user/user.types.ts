// Types & Interfaces
import type { user as TPrismaUser } from '@prisma/client'

export enum EUserRoles {
  'admin' = 'ADMIN',
  'user' = 'USER'
}

export type TUserRoles = keyof typeof EUserRoles

export type TUserCreate = {
  userData: TPrismaUser,
  token: string,
}

export type TUserJwtPayload = {
  email: string,
  uid: number,
  role: TUserRoles
}
