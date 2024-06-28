import { NestFactory } from '@nestjs/core'
import { AppModule } from './App.module'
import { EnvService } from '@infra/env/Env.service'
import { raw } from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
  })

  const envService = app.get(EnvService)
  const port = envService.get('PORT')
  const origin = envService.get('ACCEPT_ORIGINS')

  app.enableCors({
    origin,
    credentials: true,
    methods: 'GET,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: [
      'X-Total-Count',
      'X-Page-Count',
      'X-Page',
      'X-Page-Size',
      'X-Location',
    ],
  })

  app.use('/stripe/webhooks', raw({ type: 'application/json' }))

  await app.listen(port)
}

bootstrap()
