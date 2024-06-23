export function makeImageLocation(imageName?: string | null) {
  if (!imageName) return null
  return `${process.env.CLOUDFLARE_VIEW_URL}/${imageName}`
}
