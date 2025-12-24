import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import path from "node:path"
import dotenv from "dotenv"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const baseDir = process.env.PWD || process.cwd()
dotenv.config({ path: path.join(baseDir, ".env") })

const rawUrl = process.env.DATABASE_URL || "file:./dev.db"
const resolvedPath = rawUrl.startsWith("file:")
  ? rawUrl.replace(/^file:/, "")
  : rawUrl
const absolutePath =
  resolvedPath === ":memory:" ? resolvedPath : path.resolve(baseDir, resolvedPath)
const adapter = new PrismaBetterSqlite3({
  url: resolvedPath === ":memory:" ? resolvedPath : `file:${absolutePath}`,
})

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma
