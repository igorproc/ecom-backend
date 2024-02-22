import { $Enums } from '.prisma/client'

export enum EAddProductTypes {
  'base' = 'BASE',
  'configurable' = 'CONFIGURABLE',
}

interface TBaseProduct {
  pid: number,
  __typename: $Enums.products___typename,
  productImage: string,
  price: number,
  name: string,
}

interface TConfigurableProduct extends TBaseProduct {
  productOptions: TConfigurableProductOptions | null,
  productVariants: TConfigurableProductVariants | null,
}

export type TProduct = TBaseProduct | TConfigurableProduct

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
