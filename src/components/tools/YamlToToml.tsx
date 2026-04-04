"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface YamlNode {
  [key: string]: string | number | boolean | null | YamlNode | (string | number | boolean | null | YamlNode)[]
}

function parseYamlValue(val: string): string | number | boolean | null {
  if (val === "null" || val === "~") return null
  if (val === "true") return true
  if (val === "false") return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  return val
}

function parseSimpleYaml(yaml: string): YamlNode {
  const lines = yaml.split("\n")
  const root: YamlNode = {}
  const stack: { obj: YamlNode; indent: number }[] = [{ obj: root, indent: -1 }]
  let currentArray: { key: string; parent: YamlNode; items: unknown[] } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith("#")) continue

    const indent = line.search(/\S/)

    const arrayMatch = line.match(/^(\s*)- (.*)$/)
    if (arrayMatch) {
      const val = parseYamlValue(arrayMatch[2].trim())
      if (currentArray && indent >= stack[stack.length - 1].indent) {
        currentArray.items.push(val)
        continue
      }
    }

    if (currentArray) {
      currentArray.parent[currentArray.key] = currentArray.items as YamlNode[keyof YamlNode]
      currentArray = null
    }

    const match = line.match(/^(\s*)([^:\s][^:]*?)\s*:\s*(.*)$/)
    if (!match) continue

    const key = match[2].trim()
    const rawValue = match[3].trim()

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    if (rawValue === "" || rawValue === "|" || rawValue === ">") {
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ""
      const nextIndent = nextLine.search(/\S/)
      if (nextLine.trim().startsWith("- ") && nextIndent > indent) {
        currentArray = { key, parent, items: [] }
        continue
      }
      const child: YamlNode = {}
      parent[key] = child
      stack.push({ obj: child, indent })
    } else {
      parent[key] = parseYamlValue(rawValue)
    }
  }

  if (currentArray) {
    currentArray.parent[currentArray.key] = currentArray.items as YamlNode[keyof YamlNode]
  }

  return root
}

function tomlValue(val: unknown): string {
  if (val === null) return '""'
  if (typeof val === "boolean") return val ? "true" : "false"
  if (typeof val === "number") return String(val)
  if (typeof val === "string") return JSON.stringify(val)
  if (Array.isArray(val)) {
    const items = val.map(v => tomlValue(v))
    return `[${items.join(", ")}]`
  }
  return '""'
}

function objectToToml(obj: Record<string, unknown>, prefix: string = ""): string {
  const lines: string[] = []
  const sections: [string, Record<string, unknown>][] = []

  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      sections.push([key, value as Record<string, unknown>])
    } else {
      lines.push(`${key} = ${tomlValue(value)}`)
    }
  }

  for (const [key, value] of sections) {
    const sectionKey = prefix ? `${prefix}.${key}` : key
    lines.push("")
    lines.push(`[${sectionKey}]`)
    lines.push(objectToToml(value, sectionKey).replace(/^\n+/, ""))
  }

  return lines.join("\n")
}

export function YamlToTomlTool() {
  const [yaml, setYaml] = useState("")
  const [error, setError] = useState("")

  let toml = ""
  if (yaml.trim()) {
    try {
      const parsed = parseSimpleYaml(yaml)
      toml = objectToToml(parsed).trim()
      if (error) setError("")
    } catch {
      toml = ""
    }
  }

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section">
          <div className="tool-field">
            <label>YAML</label>
            <textarea
              value={yaml}
              onChange={e => { setYaml(e.target.value); setError("") }}
              rows={14}
              placeholder={"name: John\nage: 30\naddress:\n  street: 123 Main St\n  city: Anytown"}
              style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
            />
          </div>
        </div>

        <div className="tool-section">
          <div className="tool-field">
            <label>TOML</label>
            <textarea
              value={toml}
              readOnly
              rows={14}
              placeholder="TOML output will appear here..."
              style={{ fontFamily: "monospace", fontSize: "0.82rem", background: "var(--bg-secondary)" }}
            />
          </div>
          {toml && (
            <div className="tool-actions">
              <CopyButton text={toml} />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        Supports a subset of YAML: key-value pairs, nested objects, simple arrays, quoted strings, numbers, booleans, and null.
      </p>
    </div>
  )
}
