// Node Deps
import { Module } from '@nestjs/common'
import * as process from 'process'
// Util Modules
import { ConfigModule } from '@nestjs/config'
import { S3Module } from 'nestjs-s3'
import { ScheduleModule } from '@nestjs/schedule'
// Root Modules
import { UserModule } from '@/user/user.module'
import { ProductModule } from './product/product.module'
import { TasksModule } from './tasks/tasks.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    S3Module.forRoot({
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || '',
        endpoint: process.env.S3_URL,
        forcePathStyle: true,
      },
    }),
    UserModule,
    ProductModule,
    TasksModule,
  ],
})
export class AppModule {}
