// Node Deps
import { Injectable } from '@nestjs/common'
// Prisma Types
import { product as TPrismaProduct } from '@prisma/client'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Child Services
import { ConfigurableProductService } from '@/product/configurable/configurable.service'
// Validation DTO
import type {
  CreateProductDto as TAddProductInput,
  EditProductDto as TEditProductInput,
} from '@/product/dto/product.dto'
// Consts
import { DEFAULT_PAGE_SIZE } from '@/product/const/product.const'
// Types & Interfaces
import {
  EAddProductTypes,
  TProduct
} from '@/product/product.types'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configurableProduct: ConfigurableProductService,
  ) {}

  public readonly getters = {
    getAllProducts: async () => {
      try {
        const productIdsList = await this.prisma
          .product
          .findMany({
            select: { pid: true }
          })

        const productList: TProduct[] = []
        for (const item of productIdsList) {
          productList.push(
            await this.getters.getProductById(item.pid)
          )
        }

        return productList
      } catch (error) {
        throw error
      }
    },

    getProductList: async (page: number, count?: number) => {
      try {
        const skipValue = () => {
          if (!page || page === 1) {
            return 0
          }
          if (!count) {
            return page * DEFAULT_PAGE_SIZE
          }
          return page * count
        }

        const productIdsList = await this.prisma
          .product
          .findMany({
            skip: skipValue(),
            take: count || DEFAULT_PAGE_SIZE,
            select: { pid: true }
          })

        const productList: TProduct[] = []
        for (const item of productIdsList) {
          productList.push(
            await this.getters.getProductById(item.pid)
          )
        }

        return productList
      } catch (error) {
        throw error
      }
    },
    getProductById: async (productId: number) => {
      try {
        const productData = await this.prisma
          .product
          .findUnique({
            where: { pid: productId }
          })
        if (!productData) {
          return null
        }

        const formattedProductData = {
          pid: productData.pid,
          __typename: productData.typename,
          productImage: productData.productImage,
          price: productData.price,
          name: productData.name,
        }
        if (productData.typename === EAddProductTypes.base) {
          return formattedProductData
        }
        const productOptions = await this.configurableProduct
          .getters
          .getProductOptions(productId)
        const productVariants = await this.configurableProduct
          .getters
          .getProductVariants(productId)

        return {
          ...formattedProductData,
          productOptions,
          productVariants,
        }
      } catch (error) {
        throw error
      }
    },
    productIsExists: async (productId: number) => {
      try {
        return !!await this.prisma
          .product
          .findUnique({
            where: { pid: productId }
          })
      } catch (error) {
        throw error
      }
    }
  }

  public readonly actions = {
    createProduct: async (productData: TAddProductInput) => {
      try {
        const productCandidate = await this.prisma
          .product
          .create({
            data: {
              name: productData.name,
              price: productData.price,
              typename: EAddProductTypes[productData.type] || EAddProductTypes.base,
              productImage: productData.productImage,
            }
          })

        if (!productCandidate) {
          return {
            error: { code: 501, message: 'Can\'t add product' }
          }
        }
        return productCandidate
      } catch (error) {
        throw error
      }
    },
    deleteProduct: async (productId: number) => {
      try {
        return await this.prisma.product.delete({ where: { pid: productId } })
      } catch (error) {
        throw error
      }
    },
    editProductData: async (editableProductData: TEditProductInput)=> {
      try {
        const editableData: TPrismaProduct | {} = {}

        for (const [key, value] of Object.entries(editableProductData)) {
          if (!value) {
            return
          }
          editableData[key] = value
        }

        return await this.prisma
          .product
          .update({
            where: { pid: editableProductData.productId },
            data: editableData
          })
      } catch (error) {
        throw error
      }
    }
  }
}
