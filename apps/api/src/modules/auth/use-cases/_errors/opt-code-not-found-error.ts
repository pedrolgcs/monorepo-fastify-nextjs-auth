export class OptCodeNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'the provided code does not exist.')
  }
}
