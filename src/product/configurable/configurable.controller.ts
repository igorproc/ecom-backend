// Node Deps
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
// Auth Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Services
import { ConfigurableProductService } from '@/product/configurable/configurable.service'
// Decorators
import { Roles } from '@/user/auth/decorators.roles'
// Validation DTO
import {
  AddItemToOptionGroupDto,
  AddVariantGroupDto,
  AddItemToVariantGroupDto,
  AddOptionGroupDto
} from '@/product/configurable/dto/configurable-product.dto'

@Controller('product/configurable')
export class ConfigurableProductController {
  constructor(
    private readonly configurableProductService: ConfigurableProductService,
  ) {}

  @Post('createOptionGroup')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async createOptionGroup (
    @Body('optionData') optionData: AddOptionGroupDto
  ) {
    return await this.configurableProductService
      .actions
      .addOptionGroup(optionData)
  }

  @Post('addItemToOptionGroup')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async addItemToOptionGroup (
    @Body('optionItemData') optionItemData: AddItemToOptionGroupDto
  ) {
    return await this.configurableProductService
      .actions
      .addItemToOptionGroup(optionItemData)
  }

  @Post('createVariantGroup')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async createVariantGroup (
    @Body('variantData') variantData: AddVariantGroupDto
  ) {
    return await this.configurableProductService
      .actions
      .addVariantGroup(variantData)
  }

  @Post('addItemToVariantGroup')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async addItemToVariantGroup(
    @Body('variantItemData') variantItemData: AddItemToVariantGroupDto
  ) {
    return await this.configurableProductService
      .actions
      .addItemToVariantGroup(variantItemData)
  }
}
