// Node Deps
import {
  Body,
  Query,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
// Other Services
import { BrandService } from '@/product/brand/brand.service'
import { UploadService } from '@/upload/upload.service'
// Decorators
import { Roles } from '@/user/auth/decorators.roles'
// Guards
import { AuthGuard } from '@/user/auth/guards/auth.guard'
// DTO Validation
import {
  CreateBrandDto,
  GetBrandList
} from '@/product/brand/dto/brand.dto'

@Controller('product/brand')
export class BrandController {
  constructor(
    private readonly brandService: BrandService,
    private readonly uploadService: UploadService,
  ) {}

  @Get('list')
  async getBrandListByPage (
    @Query('page') page: number,
    @Query('size') size: number,

  ) {
    return await this.brandService
      .getters
      .getBrandsList({ page, size })
  }

  @Post('upload')
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
  async createBrand (
    @Body() brandData: CreateBrandDto,
  ) {
    return await this.brandService
      .actions
      .createBrand(brandData)
  }

  @Post('delete')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  async deleteBrand (
    @Query() brandId: number,
  ) {
    return await this.brandService
      .actions
      .deleteBrand(brandId)
  }
}
