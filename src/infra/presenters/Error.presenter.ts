import { UserAlreadyExistsWithSameEmail } from '@modules/users/errors/UserAlreadyExists.error'
import { UserNotFound } from '@modules/users/errors/UserNotFound.error'
import { UserWrongCredentials } from '@modules/users/errors/UserWrongCredentials.error'
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CannotGetSafeLocationForImage } from '@providers/base/images/errors/CannotGetSafeLocationForImage.error'
import { PresenterProps } from '@shared/core/contracts/Presenter'
import { ServiceError } from '@shared/core/errors/ServiceError'

/**
 *
 * @class ErrorPresenter - Present all possible application errors
 */
@Injectable()
export class ErrorPresenter {
  present(error: ServiceError): PresenterProps {
    const err = {
      message: error.message,
      title: error.title,
      status: error.status,
    }

    switch (error.constructor) {
      case UserNotFound: {
        throw new NotFoundException(err)
      }

      case UserAlreadyExistsWithSameEmail: {
        throw new ConflictException(err)
      }

      case CannotGetSafeLocationForImage: {
        throw new BadRequestException(err)
      }

      case UserWrongCredentials: {
        throw new ForbiddenException(err)
      }

      default: {
        throw new BadRequestException(err)
      }
    }
  }
}
