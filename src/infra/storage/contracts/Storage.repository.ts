export abstract class StorageRepository {
  // abstract upload(filename: string): Promise<string | null>
  abstract getSignedUrl(props: {
    filename: string
    contentType: string
  }): Promise<{ uploadUrl: string; name: string } | null>
}
