export abstract class HTMLValidations {
  abstract htmlIsValid(html?: string | null): boolean
  abstract sanitize(html?: string | null): string | null | undefined
}
