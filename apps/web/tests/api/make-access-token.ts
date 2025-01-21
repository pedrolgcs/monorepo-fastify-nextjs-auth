export async function makeAccessToken(
  email?: string,
  agent?: string,
): Promise<{ token: string }> {
  const response: { token: string } = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/sandbox/sign-in`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-staging-token': `${process.env.STAGING_API_TOKEN}`,
      },
      body: JSON.stringify({
        email: email || 'johndoe@gmail.com',
        agent: agent || 'CI',
      }),
    },
  ).then((response) => response.json())

  return {
    token: response.token,
  }
}
