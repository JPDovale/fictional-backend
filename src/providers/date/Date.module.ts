import { Module } from '@nestjs/common'
import { DateAddition } from './contracts/DateAddition'
import { DayJs } from './implementations/DayJs'
import { DateVerifications } from './contracts/DateVerifications'

@Module({
  providers: [
    {
      provide: DateAddition,
      useClass: DayJs,
    },
    {
      provide: DateVerifications,
      useClass: DayJs,
    },
  ],
  exports: [DateAddition, DateVerifications],
})
export class DateModule {}
