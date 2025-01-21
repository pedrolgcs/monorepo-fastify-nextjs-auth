export async function resetAccessByUser(email: string): Promise<void> {
  await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sandbox/clear-access-by-user`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-staging-token': `${process.env.STAGING_API_TOKEN}`,
      },
      body: JSON.stringify({
        email,
      }),
    },
  )
}
