import { Module } from '@nestjs/common'
import { Encrypter } from './contracts/Encrypter'
import { JwtEncrypter } from './implementations/JwtEncrypter'
import { Decoder } from './contracts/Decoder'
import { HashComparer } from './contracts/HashComparer'
import { BcryptHasher } from './implementations/BcryptHasher'
import { HashGenerator } from './contracts/HashGenerator'
import { HandleHashGenerator } from './contracts/HandleHashGenerator'
import { CryptoHasher } from './implementations/CryptoHasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: Decoder, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
    { provide: HandleHashGenerator, useClass: CryptoHasher },
  ],
  exports: [
    Encrypter,
    HashComparer,
    HashGenerator,
    Decoder,
    HandleHashGenerator,
  ],
})
export class CryptographyModule {}
