// Node Deps
import { Injectable } from '@nestjs/common'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Types & Interfaces
import type { TAdditionalData } from '@/product/additionalData/productAdditionalData.types'
import type {
  createAdditionalDataGroupInput,
  createAdditionalDataItemInput,
} from '@/product/additionalData/dto/additionalData.dto'

@Injectable()
export class productAdditionalDataService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  private readonly helpers = {
    getAdditionalDataGroupsById: async (productId: number) => {
      try {
        return await this
          .prisma
          .productAdditionalDataGroup
          .findMany({
            where: {
              pid: productId,
            },
          })
      } catch (error) {
        throw error
      }
    }
  }

  public readonly getters = {
    getAdditionalDataByProductId: async (productId: number)=> {
      try {
        const additionalDataGroups = await this
          .helpers
          .getAdditionalDataGroupsById(productId)

        if (!additionalDataGroups.length) {
          return null
        }

        const additionalFormattedDataGroups: TAdditionalData[] = []

        for (const additionalDataGroup of additionalDataGroups) {
          const additionalDataItems = await this
            .prisma
            .productAdditionalDataItem
            .findMany({
              where: {
                padgid: additionalDataGroup.padgid,
              },
            })

          additionalFormattedDataGroups.push({
            label:  additionalDataGroup.label,
            items: additionalDataItems.map(item => {
              return {
                id: item.padiid,
                label: item.label,
                description: item.feature,
              }
            })
          })
        }

        return additionalFormattedDataGroups
      } catch (error) {
        throw error
      }
    }
  }

  public readonly actions = {
    createAdditionalGroup: async (groupData: createAdditionalDataGroupInput) => {
      try {
        return await this
          .prisma
          .productAdditionalDataGroup
          .create({
            data: {
              pid: groupData.productId,
              label: groupData.label
            },
            select: {
              padgid: true,
              pid: true,
              label: true,
            }
          })
      } catch (error) {
        throw error
      }
    },
    createAdditionalItem: async (itemData: createAdditionalDataItemInput) => {
      try {
        return await this
          .prisma
          .productAdditionalDataItem
          .create({
            data: {
              padgid: itemData.groupId,
              label: itemData.label,
              feature: itemData.value,
            }
          })
      } catch (error) {
        throw error
      }
    },
    deleteAdditionalGroup: async (groupId: number) => {
      try {
        const additionalGroupIsDeleted = await this
          .prisma
          .productAdditionalDataGroup
          .delete({
            where: { padgid: groupId }
          })

        return { additionalGroupIsDeleted }
      } catch (error) {
        throw error
      }
    },
    deleteAdditionalItem: async (itemId: number) => {
      try {
        const additionalItemIsDeleted = await this
          .prisma
          .productAdditionalDataItem
          .delete({
            where: { padiid: itemId }
          })

        return { additionalItemIsDeleted }
      } catch (error) {
        throw error
      }
    }
  }
}
