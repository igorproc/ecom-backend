// Node Deps
import { Injectable } from '@nestjs/common'
// Prisma Types
import { product as TPrismaProduct } from '@prisma/client'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Child Services
import { ConfigurableProductService } from '@/product/configurable/configurable.service'
import { BrandService } from '@/product/brand/brand.service'
// Validation DTO
import type {
  GetProductListDto as TGetProductListInput,
  CreateProductDto as TAddProductInput,
  EditProductDto as TEditProductInput,
} from '@/product/dto/product.dto'
// Types & Interfaces
import {
  EAddProductTypes,
  TProduct
} from '@/product/product.types'
// Utils
import { getPageDataSize } from '@/product/utils/getPageData'
import { getTotalPagesBySize } from '@/product/utils/totalPagesBySize'
// Constants
import { DEFAULT_PAGE_SIZE } from '@/product/const/product.const'

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configurableProduct: ConfigurableProductService,
    private readonly brand: BrandService,
  ) {}

  public readonly getters = {
    getProductCount: async (brandId: number | null) => {
      try {
        const filters: {
          where: { bid?: number }
        } = {
          where: {}
        }

        if (brandId) {
          filters.where.bid = brandId
        }

        return await this
          .prisma
          .product
          .count(filters)
      } catch (error) {
        throw error
      }
    },

    getProductList: async (filterData: TGetProductListInput) => {
      try {
        type TSqlFilters = {
          skip: number,
          take: number,
          select: { pid: boolean },
          where: { bid?: number },
        }

        const skipValue = getPageDataSize(
          filterData.page,
          filterData.count,
          DEFAULT_PAGE_SIZE,
        )
        const filters: TSqlFilters = {
          skip: skipValue.skip,
          take: skipValue.values,
          select: { pid: true },
          where: {},
        }

        if (filterData?.brandName) {
          const brandData = await this.brand
            .getters
            .getBrandDataByName(filterData.brandName)

          filters.where.bid = brandData.bid
        }

        const productIdsList = await this.prisma
          .product
          .findMany(filters)

        const productList: TProduct[] = []
        for (const item of productIdsList) {
          productList.push(
            await this.getters.getProductById(item.pid)
          )
        }

        return {
          products: productList,
          totalProducts: await this
            .getters
            .getProductCount(filters.where?.bid || null)
        }
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
          brandId: productData.bid,
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
              bid: productData.brandId,
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
