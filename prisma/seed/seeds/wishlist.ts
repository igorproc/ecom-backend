// Node Deps
import { PrismaClient } from '@prisma/client'
// Utils
import { getDataFromJson } from '../utils/getDataFromJson'

type TWishlistsTestJson = {
  wishlists: { isGuestCard: boolean, userId: number }[]
  wishlistItems: {
    wishlistCardId: number,
    productId: number,
    variantId?: number,
  }[]
}

const prisma = new PrismaClient()

async function wishlistItemsSeed (wishlistItems: TWishlistsTestJson['wishlistItems']) {
  try {
    for (const wishlistItem of wishlistItems) {
      const wishlistData = await prisma
        .wishlist
        .findUnique({
          where: { wishlistId: wishlistItem.wishlistCardId }
        })

      if (!wishlistData) {
        continue
      }
      await prisma
        .wishlistItem
        .create({
          data: {
            wishlistToken: wishlistData.wishlistToken,
            productId: wishlistItem.productId,
            variantId: wishlistItem.variantId,
          }
        })
    }

    console.log("Test Wishlists Items was created")
  } catch (error) {
    throw error
  }
}
export async function wishlistSeed () {
  try {
    const data = getDataFromJson<TWishlistsTestJson>('wishlist.json')
    const wishlists = await prisma
      .wishlist
      .createMany({
        data: data.wishlists
      })

    if (wishlists) {
      await wishlistItemsSeed(data.wishlistItems)
      console.log("Test Wishlists was created")
    }
    prisma.$disconnect()
  } catch (error) {
    prisma.$disconnect()
    throw error
  }
}
