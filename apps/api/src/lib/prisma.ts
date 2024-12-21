import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

prisma = new PrismaClient({
  log: ['query'],
})

function resetPrismaClientInstance() {
  prisma = new PrismaClient({
    log: ['query'],
  })
}

export { prisma, resetPrismaClientInstance }
