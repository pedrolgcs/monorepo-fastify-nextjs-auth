export async function retryUntilSuccess<T>(
  operation: () => Promise<T>,
  retries: number,
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt >= retries) {
        throw error
      }
    }
  }
}
