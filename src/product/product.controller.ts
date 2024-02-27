// Node Deps
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
// Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// Guards Decorators
import { Roles } from '@/user/auth/decorators.roles'
// Other Services
import { ProductService } from '@/product/product.service'
import { UploadService } from '@/upload/upload.service'
// Validate DTO
import {
  CreateProductDto,
  EditProductDto
} from '@/product/dto/product.dto'

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('list')
  async getProductListByPage(
    @Query('page', new ParseIntPipe()) page: string,
    @Query('size', new ParseIntPipe()) size: string,
    @Query('brand') brand?: string,
  ) {
    return await this.productService
      .getters
      .getProductList({
        page: Number(page),
        count: Number(size),
        brandName: brand || null,
      })
  }

  @Get(':name')
  async getProductById(
    @Param('name') name: string
  ) {
    if (!name) {
      return { error: { code: 501, message: 'No Required Fields are sends' } }
    }

    return await this.productService
      .getters
      .getProductByName(name)
  }

  @Post('uploadImage')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5*1024*1024*8 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ]
      })
    ) image: Express.Multer.File
  ) {
    if (!image) {
      return {
        error: { code: 501, message: 'Incorrect File. JPEG files only' }
      }
    }

    return await this.uploadService
      .actions
      .uploadFile(image)
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
