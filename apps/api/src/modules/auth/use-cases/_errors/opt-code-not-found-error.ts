import { AppError } from '@/http/_errors/app-error'

export class OptCodeNotFoundError extends AppError {
  constructor(message?: string) {
    super(message ?? 'the provided code does not exist.')
  }
}
