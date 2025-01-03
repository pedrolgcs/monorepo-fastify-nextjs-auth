import dayjs from '@/lib/day-js'
import { prisma } from '@/lib/prisma'

export async function makeOptCode() {
  const code = await prisma.optCode.create({
    data: {
      code: '00000000',
      email: 'john@gmail.com',
      expiresAt: dayjs().add(1, 'day').toDate(),
    },
  })

  return code
}
