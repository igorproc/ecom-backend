// Node Deps
import { Injectable } from '@nestjs/common'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Dto Validation
import type {
  CreateBrandDto as TCreateBrandInput,
  GetBrandList as TGetBrandPageInput,
} from '@/product/brand/dto/brand.dto'
// Utils
import { getPageDataSize } from '@/product/utils/getPageData'
// Constants
import { DEFAULT_PAGE_SIZE } from '@/product/brand/const/brand.const'

@Injectable()
export class BrandService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  public readonly getters = {
    getBrandsList: async (pageData: TGetBrandPageInput) => {
      try {
        const pageDataValues = getPageDataSize(
          pageData.page,
          pageData.size,
          DEFAULT_PAGE_SIZE
        )

        return await this.prisma
          .brand
          .findMany({
            skip: pageDataValues.skip,
            take: pageDataValues.values,
            orderBy: {
              bid: pageData.filters.direction || 'asc'
            },
            select: {
              bid: true,
              name: true,
              imageUrl: true
            },
          })
      } catch (error) {
        throw error
      }
    },
    getBrandDataByName: async (brandName: string) => {
      try {
        // TODO: Переделать немедленно
        const brands = await this.prisma
          .brand
          .findMany({
            select: {
              name: true,
              bid: true
            }
          })

        return brands.find(
          brand => brand.name.toLowerCase() === brandName.toLowerCase()
        )
      } catch (error) {
        throw error
      }
    }
  }
  public readonly actions = {
    createBrand: async (brandData: TCreateBrandInput) => {
      try {
        return await this.prisma
          .brand
          .create({
            data: brandData,
            select: {
              bid: true,
              name: true,
              imageUrl: true,
            },
          })
      } catch (error) {
        throw error
      }
    },
    deleteBrand: async (brandId: number) => {
      try {
        await this.prisma
          .brand
          .delete({
            where: { bid: brandId },
          })

        return { brandIsDeleted: true }
      } catch (error) {
        throw error
      }
    }
  }
}
