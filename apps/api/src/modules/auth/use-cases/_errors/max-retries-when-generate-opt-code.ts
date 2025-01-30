import { AppError } from '@/http/_errors/app-error'

export class MaxRetriesWhenGenerateOPTCodeError extends AppError {
  constructor(message?: string) {
    super(
      message ??
        'unable to generate a unique OTP code after multiple retry attempts.',
      422,
    )
  }
}
