// import path from 'path'
// import { getDatabaseImagesPath } from '@utils/getDatabasePath'
// import { UniqueId } from '@shared/core/valueObjects/UniqueId'
// import { Injectable } from '@nestjs/common'
// import { ImagesManipulatorProvider } from '../contracts/ImagesLocalManipulator.provider'
// import { Image } from '../entities/Image'

// @Injectable()
// export class JSImagesManipulatorProvider implements ImagesManipulatorProvider {
//   async getImage(originPath: string): Promise<Image | null> {
//     if (!originPath) return null
//     const isUrl = originPath.startsWith('http')
//     const imageId = UniqueId.create()

//     let basename = path.basename(originPath)
//     let destinationPath = path.join(
//       getDatabaseImagesPath(),
//       imageId.toString().concat(basename),
//     )

//     if (isUrl) {
//       destinationPath = destinationPath.concat('.jpg')
//       basename = basename.concat('.jpg')
//     }

//     const image = Image.create(
//       {
//         name: basename,
//         path: originPath,
//         destination: destinationPath,
//       },
//       imageId,
//     )

//     return image
//   }
// }
