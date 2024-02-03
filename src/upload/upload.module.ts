// Node Deps
import { Module } from '@nestjs/common'
// Current Modules Deps
import { UploadService } from './upload.service'

@Module({
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
