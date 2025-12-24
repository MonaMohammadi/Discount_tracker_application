import { PrismaClient } from "@prisma/client"
import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3"
import Database from "better-sqlite3"
import path from "node:path"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const dbUrl = process.env.DATABASE_URL || "file:./dev.db"
const dbPath = dbUrl.startsWith("file:") ? dbUrl.replace(/^file:/, "") : dbUrl
const resolvedDbPath = dbPath === ":memory:" ? dbPath : path.resolve(process.cwd(), dbPath)
const adapter = new PrismaBetterSQLite3(new Database(resolvedDbPath))

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma
