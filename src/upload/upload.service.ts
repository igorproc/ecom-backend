// Node Deps
import { Injectable } from '@nestjs/common'
import { InjectS3, S3 } from 'nestjs-s3'
import * as process from 'process'
// Utils
import { generateFileName } from '@/upload/utils/generate.name.util'

@Injectable()
export class UploadService {
  constructor(
    @InjectS3() private readonly s3: S3
  ) {}

  public actions = {
    uploadFile: async (file: Express.Multer.File) => {
      try {
        const fileName = generateFileName(file.originalname)

        const fileIsUploaded = await this.s3.putObject({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        })

        if (fileIsUploaded.$metadata.httpStatusCode !== 200) {
          return
        }
        return `${process.env.S3_URL}/${process.env.S3_BUCKET_NAME}/${fileName}`
      } catch (error) {
        throw error
      }
    },
  }
}
