import { AppError } from '@/http/_errors/app-error'

export class RefreshTokenNotFoundError extends AppError {
  constructor(message?: string) {
    super(message ?? 'the provided refresh token does not exist or is invalid.')
  }
}
