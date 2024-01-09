// Node Deps
import { Body, Controller, Get, Post, Query, UseGuards, Param, ParseIntPipe } from "@nestjs/common";
// Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Other Services
import { ProductService } from '@/product/product.service'
// Validate DTO
import { CreateProductDto, EditProductDto } from '@/product/dto/product.dto'
import { Roles } from "@/user/auth/decorators.roles";

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Get(':id')
  async getProductById(
    @Param('id') id: string
  ) {
    if (!id || !Number(id)) {
      return { error: { code: 501, message: 'No Required Fields are sends' } }
    }

    return await this.productService
      .getters
      .getProductById(
        Number(id)
      )
  }

  @Post('create')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async createProduct(
    @Body('productData') createProductData?: CreateProductDto
  ) {
    if (!createProductData) {
      return { error: { code: 501, message: 'No Required Fields are sends' } }
    }

    return this.productService.actions.createProduct(createProductData)
  }

  @Post('edit')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async editProduct(
    @Body('editData') editProductData?: EditProductDto
  ) {
    if (!editProductData) {
      return { error: { code: 501, message: 'No Required Fields are sends' } }
    }

    return this.productService.actions.editProductData(editProductData)
  }

  @Post('delete')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Query('id', new ParseIntPipe()) productId: number
  ) {
    return await this.productService
      .actions
      .deleteProduct(
        Number(productId)
      )
  }
}
