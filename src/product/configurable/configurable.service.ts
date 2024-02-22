// Node Deps
import { Injectable } from '@nestjs/common'
// Other Services
import { PrismaService } from '@/prisma/prisma.service'
// Validation Dto
import type {
  AddOptionGroupDto as TConfigurableProductOptionGroupInput,
  AddItemToOptionGroupDto as TConfigurableProductOptionInput,
  AddVariantGroupDto as TConfigurableProductVariantGroupInput,
  AddItemToVariantGroupDto as TConfigurableProductVariantItemInput,
} from '@/product/configurable/dto/configurable-product.dto'
// Types & Interfaces
import {
  TConfigurableProductOptions,
  TConfigurableProductOption,
  TConfigurableProductVariant,
  TConfigurableProductVariants,
} from '@/product/product.types'

@Injectable()
export class ConfigurableProductService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  private readonly closedApi = {
    getProductOptionGroup: async (optionGroupId: number) => {
      try {
        return await this.prisma
          .productOptionGroup
          .findUnique({
            where: { pcoid: optionGroupId }
          })
      } catch (error) {
        throw error
      }
    },
    getProductOptionById: async (productOptionId: number) => {
      try {
        return await this.prisma
          .productOptionItem
          .findUnique({
            where: { pcoiid: productOptionId }
          })
      } catch (error) {
        throw error
      }
    },
    getProductOptionGroupWithItemsById: async (optionGroupId: number) => {
      const productOptionGroup: TConfigurableProductOption[] = []
      const optionGroupItems = await this.prisma
        .productOptionItem
        .findMany({
          where: { pcoid: optionGroupId }
        })

      if (!optionGroupItems.length) {
        return []
      }
      optionGroupItems.forEach(optionGroup => {
        productOptionGroup.push({
          label: optionGroup.label,
          optionId: optionGroup.pcoiid,
          value: optionGroup.value,
        })
      })

      return productOptionGroup
    },
    getProductVariantGroupById: async (variantGroupId: number) => {
      const productVariantGroup: TConfigurableProductVariant[] = []
      const productVariantItems = await this.prisma
        .productVariantItem
        .findMany({ where: { pcvid: variantGroupId } })

      for (const variantItem of productVariantItems) {
        const productOptionGroup = await this.closedApi.getProductOptionGroup(variantItem.optionGroupId)
        const productOption = await this.closedApi.getProductOptionById(variantItem.optionItemId)

        if (!productOptionGroup || !productOption) {
          continue
        }

        productVariantGroup.push({
          code: productOptionGroup.label,
          valueId: productOption.pcoiid,
        })
      }

      return productVariantGroup
    }
  }

  protected readonly validation = {
    optionGroupItemDataIsUnique: async (optionGroupId: number, itemData: TConfigurableProductOptionInput) => {
      try {
        const optionGroupItems = await this.prisma
          .productOptionItem
          .findMany({
            where: { pcoid: optionGroupId }
          })

        const matchedItem = optionGroupItems.filter(groupItem => {
          if (groupItem.label !== itemData.label && groupItem.value !== itemData.value) {
            return
          }
          return groupItem
        })
        return !matchedItem.length
      } catch (error) {
        throw error
      }
    },
    optionGroupLabelIsUnique: async (productId: number, label: string) => {
      const optionGroupList = await this.prisma
        .productOptionGroup
        .findMany({
          where: { pid: productId }
        })

      const matchedCandidate = optionGroupList.filter(groupItem => groupItem.label === label)
      return !matchedCandidate.length
    },
    variantGroupSkuInUnique: async (productId: number, sku: string) => {
      try {
        return await this.prisma
          .productVariantGroup
          .findFirst({
            where: { pid: productId, sku }
          })

      } catch (error) {
        throw error
      }
    },
  }

  public readonly getters = {
    getProductOptions: async (productId: number) => {
      try {
        const productOptionGroups = await this.prisma
          .productOptionGroup
          .findMany({
            where: { pid: productId }
          })
        if (!productOptionGroups.length) {
          return null
        }

        const productOptionsGroups: TConfigurableProductOptions[] = []
        for (const productGroup of productOptionGroups) {
          productOptionsGroups.push({
            optionId: productGroup.pcoid,
            optionLabel: productGroup.label,
            values: await this.closedApi.getProductOptionGroupWithItemsById(productGroup.pcoid),
          })
        }

        return productOptionsGroups
      } catch (error) {
        throw error
      }
    },
    getProductVariants: async (productId: number) => {
      try {
        const productVariantGroups = await this.prisma
          .productVariantGroup
          .findMany({
            where: { pid: productId }
          })
        if (!productVariantGroups.length) {
          return null
        }

        const variantData: TConfigurableProductVariants[] = []
        for (const variantGroup of productVariantGroups) {
          variantData.push({
            attributes: await this.closedApi.getProductVariantGroupById(variantGroup.pcvid),
            product: {
              id: variantGroup.pcvid,
              sku: variantGroup.sku,
              imageUrl: variantGroup.imageUrl
            }
          })
        }

        return variantData
      } catch (error) {
        throw error
      }
    },
  }

  public readonly actions = {
    addOptionGroup: async (optionData: TConfigurableProductOptionGroupInput) => {
      try {
        if (
          !await this.validation.optionGroupLabelIsUnique(optionData.productId, optionData.label)
        ) {
          return { error: { code: 501, message: 'Group with this label was created' } }
        }

        const optionGroupData = await this.prisma
          .productOptionGroup
          .create({
            data: { pid: optionData.productId, label: optionData.label }
          })
        if (!optionGroupData) {
          return
        }

        return {
          optionId: optionGroupData.pcoid,
          optionLabel: optionGroupData.label,
        }
      } catch (error) {
        throw error
      }
    },
    addItemToOptionGroup: async (itemData: TConfigurableProductOptionInput) => {
      try {
        if (
          !await this.validation.optionGroupItemDataIsUnique(itemData.optionGroupId, itemData)
        ) {
          return { error: { code: 501, message: 'Item with this value or label was created' } }
        }

        return await this.prisma
          .productOptionItem
          .create({
            data: {
              pcoid: itemData.optionGroupId,
              label: itemData.label,
              value: itemData.value
            }
          })
      } catch (error) {
        throw error
      }
    },
    addVariantGroup: async (variantData: TConfigurableProductVariantGroupInput) => {
      try {
        if (
          await this.validation.variantGroupSkuInUnique(variantData.productId, variantData.sku)
        ) {
          return { error: { code: 500, message: 'Group with this sku was created' } }
        }

        return await this.prisma
          .productVariantGroup
          .create({
            data: {
              pid: variantData.productId,
              sku: variantData.sku,
              imageUrl: variantData.imageUrl
            }
          })
      } catch (error) {
        throw error
      }
    },
    addItemToVariantGroup: async (variantItemData: TConfigurableProductVariantItemInput) => {
      try {
        const usedVariantOptions = await this.prisma
          .productVariantItem
          .findMany({ where: { pcvid: variantItemData.variantGroupId } })

        const optionGroupWasUsed = usedVariantOptions.find(
          variantItem => variantItem.optionGroupId === variantItemData.optionGroupId
        )

        if (optionGroupWasUsed) {
          return {
            error: { code: 500, message: 'This Option Group or Item was used in this variant' }
          }
        }

        if (
          !await this.closedApi.getProductOptionGroup(variantItemData.optionGroupId) ||
          !await this.closedApi.getProductOptionById(variantItemData.optionItemId)
        ) {
          return {
            error: { code: 500, message: 'This Option Group or Item wasn\'t create' }
          }
        }
        return await this.prisma
          .productVariantItem
          .create({
            data: {
              pcvid: variantItemData.variantGroupId,
              optionGroupId: variantItemData.optionGroupId,
              optionItemId: variantItemData.optionItemId
            }
          })
      } catch (error) {
        throw error
      }
    }
  }
}
