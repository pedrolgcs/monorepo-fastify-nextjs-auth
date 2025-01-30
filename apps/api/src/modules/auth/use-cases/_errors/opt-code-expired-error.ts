export class OptCodeExpiredError extends Error {
  constructor(message?: string) {
    super(message ?? 'the provided code has expired.')
  }
}
