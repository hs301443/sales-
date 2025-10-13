import { PrismaClient } from '@prisma/client'

// Create a single PrismaClient instance across hot-reloads (nodemon)
const globalForPrisma = globalThis

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


export default prisma


