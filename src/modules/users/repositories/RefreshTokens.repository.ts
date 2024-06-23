import { Repository } from '@shared/core/contracts/Repository'
import { RefreshToken } from '../entities/RefreshToken'

export abstract class RefreshTokensRepository<T = unknown> extends Repository<
  RefreshToken,
  T
> {
  abstract findByUserIdAndToken(
    userId: string,
    token: string,
  ): Promise<RefreshToken | null>
}
