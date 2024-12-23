export class MaxRetriesWhenGenerateOPTCodeError extends Error {
  constructor(message?: string) {
    super(
      message ??
        'unable to generate a unique OTP code after multiple retry attempts.',
    )
  }
}
