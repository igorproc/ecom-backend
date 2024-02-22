// Node Deps
import { PrismaClient } from '@prisma/client'
// Seeds
import { productSeed } from './seeds/product'
import { brandSeed } from './seeds/brand'
import { userSeed } from './seeds/user'
import { wishlistSeed } from './seeds/wishlist'

const prisma = new PrismaClient()

async function main() {
   await userSeed()
   await brandSeed()
   await productSeed()
   await wishlistSeed()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
