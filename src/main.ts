import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import * as process from "process";

async function bootstrap() {
  const isProd = process.env.APP_MODE === 'production'
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    credentials: true,
    origin: true,
    maxAge: 604800
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: isProd,
    })
  )

  await app.listen(process.env.APP_PORT)
}
bootstrap()
