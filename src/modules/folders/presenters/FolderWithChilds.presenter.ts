import { Presenter, PresenterProps } from '@shared/core/contracts/Presenter'
import { StatusCode } from '@shared/core/types/StatusCode'
import { Injectable } from '@nestjs/common'
import { FolderWithChilds } from '../valueObjects/FolderWithChilds'

export interface FolderWithChildsResponse {
  id: string
  name: string
  files: {
    id: string
    title: string
  }[]
  childs?: FolderWithChildsResponse[]
  parentId: string | null
  projectId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface FolderWithChildsPresented {
  folder: FolderWithChildsResponse
}

export interface FoldersWithChildsPresented {
  folders: FolderWithChildsResponse[]
}

@Injectable()
export class FolderWithChildsPresenter
  implements
    Presenter<
      FolderWithChilds,
      FolderWithChildsPresented,
      FoldersWithChildsPresented
    >
{
  private parse(raw: FolderWithChilds): FolderWithChildsResponse {
    function map(raw: FolderWithChilds): FolderWithChildsResponse {
      return {
        id: raw.id.toString(),
        childs: raw.childs.map(map),
        parentId: raw.parentId?.toString() ?? null,
        name: raw.name,
        files: raw.files.map((file) => ({
          id: file.id.toString(),
          title: file.title,
        })),
        projectId: raw.projectId.toString(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      }
    }

    return map(raw)
  }

  present(
    raw: FolderWithChilds,
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FolderWithChildsPresented> {
    return {
      status,
      data: {
        folder: this.parse(raw),
      },
    }
  }

  presentMany(
    raws: FolderWithChilds[],
    status: StatusCode = StatusCode.OK,
  ): PresenterProps<FoldersWithChildsPresented> {
    return {
      status,
      data: {
        folders: raws.map(this.parse),
      },
    }
  }
}
