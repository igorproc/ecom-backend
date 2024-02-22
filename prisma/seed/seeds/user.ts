// Node Deps
import { PrismaClient } from '@prisma/client'
import { hashSync } from 'bcrypt'
// Utils
import { getDataFromJson } from '../utils/getDataFromJson'
// Types & Interfaces
import { $Enums } from '.prisma/client'

type TUsersTestJson = {
  users: {
    email: string
    password: string
    birthday: Date | string
    role?: $Enums.users_role
  }[]
}

const prisma = new PrismaClient()

async function createUser (userData: TUsersTestJson['users'][0]) {
  try {
    return await prisma
      .user
      .create({
        data: {
          email: userData.email,
          password: hashSync(userData.password, 10),
          birthday: userData.birthday,
          role: userData.role,
        },
      })
  } catch (error) {
    throw error
  }
}

export async function userSeed () {
  try {
    const data = getDataFromJson<TUsersTestJson>('user.json')
    const promises = data.users.map(createUser)

    await Promise.all(promises)
    console.log("Test Users was created")
    await prisma.$disconnect()
  } catch (error) {
    await prisma.$disconnect()
    throw error
  }
}
