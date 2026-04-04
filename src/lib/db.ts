import Database from "better-sqlite3"
import path from "path"

const DB_PATH = path.join(process.cwd(), "public", "data", "tools.db")

export interface ToolRecord {
  id: number
  name: string
  slug: string
  description: string
  category: string
  icon: string
  status: string
  confidence: string
  importance: number
  start_date: string
}

export function getDb(): Database.Database {
  return new Database(DB_PATH, { readonly: true })
}

export function getAllTools(): ToolRecord[] {
  const db = getDb()
  try {
    return db.prepare("SELECT * FROM tools ORDER BY category, name").all() as ToolRecord[]
  } finally {
    db.close()
  }
}

export function getToolBySlug(slug: string): ToolRecord | undefined {
  const db = getDb()
  try {
    return db.prepare("SELECT * FROM tools WHERE slug = ?").get(slug) as ToolRecord | undefined
  } finally {
    db.close()
  }
}

export function getCategories(): string[] {
  const db = getDb()
  try {
    const rows = db.prepare("SELECT DISTINCT category FROM tools ORDER BY category").all() as { category: string }[]
    return rows.map(r => r.category)
  } finally {
    db.close()
  }
}

export function getToolsByCategory(): Record<string, ToolRecord[]> {
  const tools = getAllTools()
  const grouped: Record<string, ToolRecord[]> = {}
  for (const tool of tools) {
    if (!grouped[tool.category]) grouped[tool.category] = []
    grouped[tool.category].push(tool)
  }
  return grouped
}
