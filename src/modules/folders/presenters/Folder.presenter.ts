import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'
import { Folder } from '../entities/Folder'

export interface FolderResponse {
  id: string
  name: string
  childs?: FolderResponse[]
  parentId: string | null
  projectId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface FolderPresented {
  folder: FolderResponse
}

export interface FoldersPresented {
  folders: FolderResponse[]
}

@Injectable()
export class FolderPresenter
  implements Presenter<Folder, FolderPresented, FoldersPresented>
{
  private parse(raw: Folder): FolderResponse {
    function map(raw: Folder) {
      return {
        id: raw.id.toString(),
        childs: raw.childs.getItems().map(map),
        parentId: raw.parentId?.toString() ?? null,
        name: raw.name,
        projectId: raw.projectId.toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    }

    return map(raw)
  }

  present(
    raw: Folder,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FolderPresented> {
    return {
      status,
      data: {
        folder: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: Folder[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FoldersPresented> {
    return {
      status,
      data: {
        folders: raws.map(this.parse),
      },
    }
  }
}
