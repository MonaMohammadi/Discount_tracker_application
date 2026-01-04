import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const findProjectRoot = (startDir: string) => {
  let current = startDir
  for (let i = 0; i < 6; i += 1) {
    if (fs.existsSync(path.join(current, "package.json"))) {
      return current
    }
    const parent = path.dirname(current)
    if (parent === current) break
    current = parent
  }
  return startDir
}

const projectRoot = findProjectRoot(process.cwd())
dotenv.config({ path: path.join(projectRoot, ".env") })

const rawUrl = process.env.DATABASE_URL || "file:./prisma/dev.db"
const resolvedPath = rawUrl.startsWith("file:")
  ? rawUrl.replace(/^file:/, "")
  : rawUrl
const absolutePath =
  resolvedPath === ":memory:" ? resolvedPath : path.resolve(projectRoot, resolvedPath)
const adapter = new PrismaBetterSqlite3({
  url: resolvedPath === ":memory:" ? resolvedPath : `file:${absolutePath}`,
})

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma
