import { EnvService } from '@infra/env/Env.service'
import { Injectable } from '@nestjs/common'
import adim from 'firebase-admin'

@Injectable()
export class FirebaseService {
  private app: adim.app.App

  constructor(envService: EnvService) {
    const fileConfig = require(envService.get('FIREBASE_CONFIG_PATH'))

    this.app = adim.initializeApp({
      credential: adim.credential.cert(fileConfig),
    })
  }

  get firebase() {
    return this.app
  }
}
