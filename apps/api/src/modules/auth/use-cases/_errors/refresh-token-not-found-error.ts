export class RefreshTokenNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? 'the provided refresh token does not exist or is invalid.')
  }
}
