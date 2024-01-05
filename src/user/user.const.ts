import { genSaltSync } from 'bcrypt'

export const USER_PASSWORD_SALT=genSaltSync(5)
