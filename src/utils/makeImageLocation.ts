export function makeImageLocation(imageName?: string | null) {
  if (!imageName) return null
  return `https://pub-e7010998082d4cf29f84e4d3aa1f737f.r2.dev/${imageName}`
}
