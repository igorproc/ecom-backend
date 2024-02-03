// Node Deps
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import * as process from 'process'
// Utils
import * as cookieParser from 'cookie-parser'
// Root Module
import { AppModule } from './app.module'

async function bootstrap() {
  const isProd = process.env.APP_MODE === 'production'
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('/api')
  app.use(
    cookieParser()
  )
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
