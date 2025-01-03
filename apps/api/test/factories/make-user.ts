import { prisma } from '@/lib/prisma'

export async function makeUser() {
  const code = await prisma.user.create({
    data: {
      email: 'john@gmail.com',
    },
  })

  return code
}
