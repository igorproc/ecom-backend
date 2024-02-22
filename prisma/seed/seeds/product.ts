// Node Deps
import { PrismaClient } from '@prisma/client'
// Utils
import { getDataFromJson } from '../utils/getDataFromJson'
// Types & Interfaces
import { $Enums } from '.prisma/client'

interface IProduct {
  name: string,
  price: number,
  bid: number,
  typename: $Enums.products___typename,
  productImage: string
}

interface IProductOptions {
  groups: {
    pid: number,
    label: string
  }[],
  items: {
    pcoid: number,
    label: string,
    value: string,
  }[]
}

interface IProductVariants {
  groups: {
    pid: number,
    sku: string,
    imageUrl: string,
  }[],
  items: {
    pcvid: number,
    optionGroupId: number,
    optionItemId: number,
  }[],
}

type TProductsTestJson = {
  products: IProduct[],
  productsOptions: IProductOptions,
  productVariants: IProductVariants,
}

const prisma = new PrismaClient()

async function productOptionsSeed(productOptions: IProductOptions) {
  try {
    const productOptionsGroups = await prisma
      .productOptionGroup
      .createMany({
        data: productOptions.groups
      })

    const productOptionsItems = await prisma
      .productOptionItem
      .createMany({
        data: productOptions.items
      })

    if (productOptionsGroups && productOptionsItems) {
      console.log('Test Configurable Product options filler')
    }
  } catch (error) {
    throw error
  }
}
async function productVariantsSeed(productVariants: IProductVariants) {
  try {
    const productVariantsGroups = await prisma
      .productVariantGroup
      .createMany({
        data: productVariants.groups
      })

    const productVariantsItems = await prisma
      .productVariantItem
      .createMany({
        data: productVariants.items
      })

    if (productVariantsGroups && productVariantsItems) {
      console.log('Test Configurable Product variants filler')
    }
  } catch (error) {
    throw error
  }
}
export async function productSeed() {
  try {
    const data = getDataFromJson<TProductsTestJson>(
      'product.json',
    )

    const products = await prisma
      .product
      .createMany({
        data: data.products
      })

    if (products) {
      await Promise.all([
        productOptionsSeed(data.productsOptions),
        productVariantsSeed(data.productVariants),
      ])
      console.log('Test Products was created')
    }
    await prisma.$disconnect()
  } catch (error) {
    await prisma.$disconnect()
    throw error
  }
}
