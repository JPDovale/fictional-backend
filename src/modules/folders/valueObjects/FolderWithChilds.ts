import { ValueObject } from '@shared/core/entities/ValueObject'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

interface FolderWithChildsProps {
  id: UniqueId
  parentId: UniqueId | null
  projectId: UniqueId
  childs: FolderWithChilds[]
  files: {
    id: UniqueId
    title: string
  }[]
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export class FolderWithChilds extends ValueObject<FolderWithChildsProps> {
  static create(props: FolderWithChildsProps) {
    const folderWithChilds = new FolderWithChilds(props)
    return folderWithChilds
  }

  get id() {
    return this.props.id
  }

  get parentId() {
    return this.props.parentId
  }

  get projectId() {
    return this.props.projectId
  }

  get childs() {
    return this.props.childs
  }

  get files() {
    return this.props.files
  }

  get name() {
    return this.props.name
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
