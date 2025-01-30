import { AppError } from '@/http/_errors/app-error'

export class OptCodeExpiredError extends AppError {
  constructor(message?: string) {
    super(message ?? 'the provided code has expired.')
  }
}
