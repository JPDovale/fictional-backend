import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { File } from '../entities/File'
import { Injectable } from '@nestjs/common'

export interface FileResponse {
  id: string
  title: string
  content: string
  projectId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface FilePresented {
  file: FileResponse
}

export interface FilesPresented {
  files: FileResponse[]
}

@Injectable()
export class FilePresenter
  implements Presenter<File, FilePresented, FilesPresented>
{
  private parse(raw: File): FileResponse {
    return {
      id: raw.id.toString(),
      title: raw.title,
      content: raw.content,
      projectId: raw.projectId.toString(),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  present(
    raw: File,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FilePresented> {
    return {
      status,
      data: {
        file: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: File[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FilesPresented> {
    return {
      status,
      data: {
        files: raws.map(this.parse),
      },
    }
  }
}
