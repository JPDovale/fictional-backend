// import 'newrelic'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './App.module'
import { EnvService } from '@infra/env/Env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: false,
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true,
      exposedHeaders: [
        'X-Total-Count',
        'X-Page-Count',
        'X-Page',
        'X-Page-Size',
        'X-Location',
      ],
    },
  })

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}

bootstrap()
