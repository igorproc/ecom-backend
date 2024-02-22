// Node Deps
import { PrismaClient } from '@prisma/client'
// Utils
import { getDataFromJson } from '../utils/getDataFromJson'

type TProductsTestJson = {
  brands: {
    name: string,
    imageUrl: string
  }[]
}

const prisma = new PrismaClient()
export async function brandSeed() {
  try {
    const data = getDataFromJson<TProductsTestJson>('brand.json')
    const brands = await prisma
      .brand
      .createMany({
        data: data.brands
      })

    if (brands) {
      console.log("Test Brands was created")
    }
    await prisma.$disconnect()
  } catch (error) {
    await prisma.$disconnect()
    throw error
  }
}
