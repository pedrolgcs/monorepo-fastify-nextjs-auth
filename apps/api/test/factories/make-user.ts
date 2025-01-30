import { prisma } from '@/lib/prisma'

export async function makeUser(email?: string) {
  const code = await prisma.user.create({
    data: {
      email: email || 'john@gmail.com',
    },
  })

  return code
}
