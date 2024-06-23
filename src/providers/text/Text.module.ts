import { Module } from '@nestjs/common'
import { HTMLValidations } from './contracts/HMTLValidations'
import { HTMLValidationsImplemented } from './implementations/HTMLValidationsImplemented'

@Module({
  providers: [
    {
      provide: HTMLValidations,
      useClass: HTMLValidationsImplemented,
    },
  ],
  exports: [HTMLValidations],
})
export class TextModule {}
