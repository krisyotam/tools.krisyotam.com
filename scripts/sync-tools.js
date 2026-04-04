#!/usr/bin/env node
/**
 * sync-tools.js
 *
 * Reads YAML front matter from every MDX file in src/content/tools/
 * and upserts the tool metadata into public/data/tools.db.
 *
 * Expected front matter keys:
 *   name        – display name
 *   description – one-line description
 *   category    – sidebar category
 *   icon        – PascalCase lucide-react icon name
 *
 * Usage:  node scripts/sync-tools.js
 */

const Database = require("better-sqlite3")
const matter = require("gray-matter")
const path = require("path")
const fs = require("fs")

const TOOLS_DIR = path.join(__dirname, "..", "src", "content", "tools")
const DB_PATH = path.join(__dirname, "..", "public", "data", "tools.db")

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

// Remove existing DB and recreate
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH)

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'FileText'
  )
`)

const insert = db.prepare(
  "INSERT INTO tools (name, slug, description, category, icon) VALUES (?, ?, ?, ?, ?)"
)

// Read all MDX files
const files = fs.readdirSync(TOOLS_DIR).filter(f => f.endsWith(".mdx")).sort()

const errors = []
const tools = []

for (const file of files) {
  const slug = file.replace(/\.mdx$/, "")
  const raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf-8")
  const { data } = matter(raw)

  if (!data.name || !data.description || !data.category) {
    errors.push(`${file}: missing required front matter (name, description, category)`)
    continue
  }

  tools.push({
    name: data.name,
    slug,
    description: data.description,
    category: data.category,
    icon: data.icon || "FileText",
  })
}

if (errors.length > 0) {
  console.error("[sync-tools] Errors found:")
  errors.forEach(e => console.error("  -", e))
  process.exit(1)
}

const insertMany = db.transaction(() => {
  for (const t of tools) {
    insert.run(t.name, t.slug, t.description, t.category, t.icon)
  }
})

insertMany()

console.log(`[sync-tools] Synced ${tools.length} tools from MDX front matter into ${DB_PATH}`)
db.close()
