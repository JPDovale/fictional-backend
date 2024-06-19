import { Image } from '../entities/Image'

export abstract class ImagesManipulatorProvider {
  abstract getImage(originPath?: string): Promise<Image | null>
}
