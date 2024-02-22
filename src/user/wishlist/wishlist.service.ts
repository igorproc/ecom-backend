// Node Deps
import { Injectable } from '@nestjs/common'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
import { AuthService } from '@/user/auth/auth.service'
import { ProductService } from '@/product/product.service'
// Prisma Types
import { product as TPrismaProduct } from '@prisma/client'
// Validation DTO
import {
  AddProductToWishlistDto as TUserWishlistAddProductInput,
  RemoveProductFromWishlistDto as TUserWishlistRemoveProductInput,
} from '@/user/wishlist/dto/wishlist.dto'
// Types & Interfaces
import { TProduct } from '@/product/product.types'
import {
  TWishlistAssignCartsInput,
  TWishlistProductId,
  TWishlistReassignCartsInput
} from '@/user/wishlist/wishlist.types'
// Utils
import { getArrayDifference } from '@utils/getArrayDiffernce.util'

@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly product: ProductService,
  ) {}

  protected readonly validation = {
    productIsExistsInWishlist: async (productData: TUserWishlistAddProductInput) => {
      try {
        return await this.prisma
          .wishlistItem
          .findFirst({
            where: productData
          })
      } catch (error) {
        throw error
      }
    }
  }

  public readonly getters = {
    getWishlistDataWithProductIds: async (wishlistToken: string) => {
      try {
        const wishlistData = await this.prisma.wishlist.findFirst({
          where: { wishlistToken }
        })
        const wishlistProducts = await this.prisma.wishlistItem.findMany({
          where: { wishlistToken }
        })

        const wishlistProductIds = wishlistProducts.map(wishlistProduct => {
          const data: TWishlistProductId = {
            itemId: wishlistProduct.wishlistItemId,
            productId: wishlistProduct.productId
          }
          if (wishlistProduct.variantId) {
            data.variantId = wishlistProduct.variantId
          }
          return data
        })

        return {
          wishlistData,
          productIds: wishlistProductIds,
        }
      } catch (error) {
        throw error
      }
    },
    getWishlistProducts: async (wishlistToken: string) => {
      try {
        type TWishlistItem = {
          productData: TProduct | TPrismaProduct,
          selectedVariant: number |  null,
        }
        const productList: TWishlistItem[] = []

        const productIdsList = await this.prisma
          .wishlistItem
          .findMany({
            where: { wishlistToken },
            select: {
              productId: true,
              variantId: true,
            }
          })
        for (const productId of productIdsList) {
          const productData = await this.product
            .getters
            .getProductById(productId.productId)

          productList.push({
            productData,
            selectedVariant: productId.variantId
          })
        }

        return productList
      } catch (error) {
        throw error
      }
    }
  }

  public readonly actions = {
    createWishlistCart: async (token?: string) => {
      try {
        if (!token) {
          return await this.prisma
            .wishlist
            .create({
              data: { isGuestCard: true }
            })
        }

        const userTokenPayload = this.auth.getters.getTokenData(token)
        if (!userTokenPayload) {
          return { error: { code: 500, message: 'Unauthorized Exception' } }
        }

        return await this.prisma
          .wishlist
          .create({
            data: {
              isGuestCard: false,
              userId: userTokenPayload.uid
            }
          })
      } catch (error) {
        throw error
      }
    },
    deleteWishlist: async (wishlistToken: string) => {
      try {
        const wishlistIsDeleted = await this.prisma
          .wishlist
          .delete({
            where: { wishlistToken }
          })

        return { wishlistIsDeleted: !!wishlistIsDeleted }
      } catch (error) {
        throw error
      }
    },
    addProductToWishlistItem: async (productData: TUserWishlistAddProductInput) => {
      try {
        const productIsExists = await this.product.getters.productIsExists(productData.productId)
        if (!productIsExists) {
          return { productIsAdded: false }
        }

        const productIsInWishlist = await this.validation.productIsExistsInWishlist(productData)
        if (productIsInWishlist) {
          return { productIsAdded: false }
        }

        const productIsAdded = await this.prisma
          .wishlistItem
          .create({ data: productData })

        return {
          itemId: productIsAdded.wishlistItemId,
          productId: productIsAdded.productId,
          variantId: productIsAdded.variantId
        }
      } catch (error) {
        throw error
      }
    },
    deleteProductFromWishlist: async (productData: TUserWishlistRemoveProductInput) => {
      try {
        return await this.prisma
          .wishlistItem
          .delete({
            where: productData,
            select: {
              wishlistItemId: true,
              productId: true,
              variantId: true,
            }
          })
      } catch (error) {
        throw error
      }
    },
    reassignWishlist: async (wishlistTokens: TWishlistReassignCartsInput) => {
      try {
        const isReassign = await this.prisma
          .wishlist
          .updateMany({
            where: { wishlistToken: wishlistTokens.guestWishlistToken },
            data: { wishlistToken: wishlistTokens.userWishlistToken },
          })

        if (isReassign.count) {
          return wishlistTokens.userWishlistToken
        }
        return null
      } catch (error) {
        throw error
      }
    },
    assignWishlist: async (wishlistTokens: TWishlistAssignCartsInput) => {
      try {
        const authTokenPayload = this.auth
          .getters
          .getTokenData(wishlistTokens.authToken)
        const userWishlistToken = await this.prisma
          .wishlist
          .findFirst({
            where: { userId: authTokenPayload.uid }
          })

        const guestWishlistIds = await this.getters
          .getWishlistDataWithProductIds(wishlistTokens.guestWishlistToken)
        const userWishlistIds = await this.getters
          .getWishlistDataWithProductIds(userWishlistToken.wishlistToken)
        if (!guestWishlistIds || !userWishlistIds) {
          return { error: { code: 500, message: 'Server Error' } }
        }

        const productIdsDifference = getArrayDifference<TWishlistProductId>(
          userWishlistIds.productIds,
          guestWishlistIds.productIds,
          ['productId', 'variantId']
        )
        for (const productPayload of productIdsDifference) {
          await this.prisma
            .wishlistItem
            .updateMany({
              where: {
                wishlistToken: wishlistTokens.guestWishlistToken,
                productId: productPayload.productId,
                variantId: productPayload.variantId
              },
              data: { wishlistToken: userWishlistToken.wishlistToken }
            })
        }
        await this.actions.deleteWishlist(wishlistTokens.guestWishlistToken)

        return userWishlistToken.wishlistToken
      } catch (error) {
        throw error
      }
    },
  }
}
