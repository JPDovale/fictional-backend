import { Module } from '@nestjs/common'
import { EnvModule } from '@infra/env/Env.module'
import { CloudflareService } from './cloudflare/Cloudflare.service'
import { StorageRepository } from './contracts/Storage.repository'
import { CloudflareStorageRepository } from './cloudflare/CloudflareStorage.repository'

@Module({
  providers: [
    CloudflareService,
    {
      provide: StorageRepository,
      useClass: CloudflareStorageRepository,
    },
  ],
  exports: [StorageRepository],
  imports: [EnvModule],
})
export class StorageModule {}
