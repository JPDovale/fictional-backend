import { Injectable } from '@nestjs/common'
import { CloudflareService } from './Cloudflare.service'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { EnvService } from '@infra/env/Env.service'
import { StorageRepository } from '../contracts/Storage.repository'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { getSignedUrl as GetSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class CloudflareStorageRepository implements StorageRepository {
  constructor(
    private readonly cloudflare: CloudflareService,
    private readonly env: EnvService,
  ) {}

  async getSignedUrl(props: {
    filename: string
    contentType: string
  }): Promise<{ uploadUrl: string; name: string } | null> {
    const fileKey = UniqueId.create()
      .toString()
      .concat('-oo-')
      .concat(props.filename)

    try {
      const signedUrl = await GetSignedUrl(
        this.cloudflare.r2,
        new PutObjectCommand({
          Bucket: this.env.get('CLOUDFLARE_BUCKET'),
          Key: fileKey,
          ContentType: props.contentType,
        }),
        { expiresIn: 900 },
      )

      return { uploadUrl: signedUrl, name: fileKey }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
