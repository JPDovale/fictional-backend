import { WatchedList } from '@shared/core/entities/WatchedList'
import { File } from '@modules/files/entities/File'

export class FolderFilesList extends WatchedList<File> {
  compareItems(a: File, b: File): boolean {
    return a.equals(b)
  }
}
