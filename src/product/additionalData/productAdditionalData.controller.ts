// Node Deps
import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common'
// ...
import {
  productAdditionalDataService
} from '@/product/additionalData/productAddtitionalData.service'
// Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Decorators
import { Roles } from '@/user/auth/decorators.roles'
// Validator Dto
import {
  createAdditionalDataGroupInput,
  createAdditionalDataItemInput,
} from '@/product/additionalData/dto/additionalData.dto'

@Controller('product')
export class productAdditionalDataController {
  constructor(
    private readonly productAdditionalDataService: productAdditionalDataService,
  ) {}

  @Get('getAdditionalData/:id')
  async getProductAdditionalData (
    @Param('id') id: number
  ) {
    return await this
      .productAdditionalDataService
      .getters
      .getAdditionalDataByProductId(id)
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('addAdditionalProductGroup')
  async addAdditionalProductGroup (
    @Body('groupData') groupData: createAdditionalDataGroupInput
  ) {
    return await this
      .productAdditionalDataService
      .actions
      .createAdditionalGroup(groupData)
  }

  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @Post('addAdditionalProductItem')
  async addAdditionalProductItem (
    @Body('itemData') itemData: createAdditionalDataItemInput
  ) {
    return await this
      .productAdditionalDataService
      .actions
      .createAdditionalItem(itemData)
  }
}
