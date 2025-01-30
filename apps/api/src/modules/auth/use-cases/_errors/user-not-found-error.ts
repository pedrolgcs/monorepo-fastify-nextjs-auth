import { AppError } from '@/http/_errors/app-error'

export class UserNotFoundError extends AppError {
  constructor(message?: string) {
    super(message ?? 'the provided user does not exist.')
  }
}
