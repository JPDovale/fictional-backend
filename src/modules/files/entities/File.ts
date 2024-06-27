import { AggregateRoot } from '@shared/core/entities/AggregateRoot'
import { Optional } from '@shared/core/types/Optional'
import { UniqueId } from '@shared/core/valueObjects/UniqueId'

interface FileProps {
  title: string
  content: string
  projectId: UniqueId
  folderId: UniqueId | null
  createdAt: Date
  updatedAt: Date | null
  trashedAt: Date | null
}

export class File extends AggregateRoot<FileProps> {
  static create(
    props: Optional<
      FileProps,
      'createdAt' | 'updatedAt' | 'content' | 'title' | 'trashedAt' | 'folderId'
    >,
    id?: UniqueId,
  ) {
    const fileProps: FileProps = {
      ...props,
      trashedAt: props.trashedAt ?? null,
      title: props.title ?? 'Untitled',
      content: props.content ?? '',
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? null,
      folderId: props.folderId ?? null,
    }

    const file = new File(fileProps, id)

    return file
  }

  get title(): string {
    return this.props.title
  }

  set title(title: string | undefined | null) {
    this.props.title =
      title === undefined
        ? this.props.title
        : title === null
          ? 'Untitled'
          : title
    this.touch()
  }

  get content(): string {
    return this.props.content
  }

  set content(content: string | undefined | null) {
    this.props.content =
      content === undefined
        ? this.props.content
        : content === null
          ? ''
          : content
    this.touch()
  }

  get projectId() {
    return this.props.projectId
  }

  get folderId() {
    return this.props.folderId
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

  moveToTrash() {
    this.props.trashedAt = new Date()
  }
}
