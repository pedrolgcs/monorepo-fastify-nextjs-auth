export async function makeOptCode(email: string): Promise<{ code: string }> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sandbox/generate-opt-code`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-staging-token': `${process.env.STAGING_API_TOKEN}`,
      },
      body: JSON.stringify({ email }),
    },
  ).then((response) => response.json())

  return response
}
