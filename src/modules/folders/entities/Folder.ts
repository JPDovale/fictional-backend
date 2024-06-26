import { AggregateRoot } from '@shared/core/entities/AggregateRoot'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'
import { FolderChildsList } from './FolderChildsList'
import { Optional } from '@shared/core/types/Optional'

interface FolderProps {
  name: string
  projectId: UniqueId
  parentId: UniqueId | null
  childs: FolderChildsList
  createdAt: Date
  updatedAt: Date | null
  trashedAt: Date | null
}

export class Folder extends AggregateRoot<FolderProps> {
  static create(
    props: Optional<
      FolderProps,
      'name' | 'parentId' | 'createdAt' | 'trashedAt' | 'updatedAt' | 'childs'
    >,
    id?: UniqueId,
  ) {
    const folderProps: FolderProps = {
      projectId: props.projectId,
      updatedAt: props.updatedAt ?? null,
      createdAt: props.createdAt ?? new Date(),
      trashedAt: props.trashedAt ?? null,
      parentId: props.parentId ?? null,
      name: props.name ?? 'Untitled',
      childs: props.childs ?? new FolderChildsList(),
    }

    const folder = new Folder(folderProps, id)

    return folder
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string | null | undefined) {
    if (name === undefined) return

    this.props.name = name ?? 'Untitled'
    this.touch()
  }

  get projectId() {
    return this.props.projectId
  }

  get parentId() {
    return this.props.parentId
  }

  get childs() {
    return this.props.childs
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get trashedAt() {
    return this.props.trashedAt
  }

  touch() {
    this.props.updatedAt = new Date()
  }
}
