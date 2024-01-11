// Prisma Types
import type { product as TPrismaProduct } from '@prisma/client'

export enum EAddProductTypes {
  'base' = 'BASE',
  'configurable' = 'CONFIGURABLE',
}

export type TProduct = TPrismaProduct & {
  productOptions: TConfigurableProductOptions,
  productVariants: TConfigurableProductVariants,
}

// Configurable Types
export type TConfigurableProductOptions = {
  optionId: number,
  optionLabel: string,
  values: TConfigurableProductOption[] | null
}

export type TConfigurableProductOption = {
  label: string,
  optionId: number,
  value: string
}

export type TConfigurableProductVariants = {
  attributes: TConfigurableProductVariant[],
  product: {
    id: number,
    sku: string,
    imageUrl: string
  }
}

export type TConfigurableProductVariant = {
  code: string,
  valueId: number,
}

export type TConfigurableProductOptionInput = {
  label: string,
  value: string,
}
