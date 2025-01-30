export class UserNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'the provided user does not exist.')
  }
}
