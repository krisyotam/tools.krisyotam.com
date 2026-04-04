"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function parseTomlValue(val: string): unknown {
  val = val.trim()
  if (val === "true") return true
  if (val === "false") return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val)
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  if (val.startsWith("[") && val.endsWith("]")) {
    const inner = val.slice(1, -1).trim()
    if (!inner) return []
    return splitTomlArray(inner).map(item => parseTomlValue(item.trim()))
  }
  return val
}

function splitTomlArray(s: string): string[] {
  const items: string[] = []
  let depth = 0
  let current = ""
  let inStr = false
  let strChar = ""

  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (inStr) {
      current += ch
      if (ch === strChar && s[i - 1] !== "\\") inStr = false
      continue
    }
    if (ch === '"' || ch === "'") {
      inStr = true
      strChar = ch
      current += ch
      continue
    }
    if (ch === "[") { depth++; current += ch; continue }
    if (ch === "]") { depth--; current += ch; continue }
    if (ch === "," && depth === 0) {
      items.push(current)
      current = ""
      continue
    }
    current += ch
  }
  if (current.trim()) items.push(current)
  return items
}

function parseToml(toml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  let currentSection = result

  const lines = toml.split("\n")

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    // Section header
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/)
    if (sectionMatch) {
      const keys = sectionMatch[1].split(".")
      let target = result
      for (const key of keys) {
        const k = key.trim()
        if (!target[k] || typeof target[k] !== "object") {
          target[k] = {}
        }
        target = target[k] as Record<string, unknown>
      }
      currentSection = target
      continue
    }

    // Key = value
    const kvMatch = trimmed.match(/^([^=]+?)\s*=\s*(.+)$/)
    if (kvMatch) {
      const key = kvMatch[1].trim()
      const value = parseTomlValue(kvMatch[2])
      currentSection[key] = value
    }
  }

  return result
}

export function TomlToJsonTool() {
  const [toml, setToml] = useState("")
  const [error, setError] = useState("")

  let json = ""
  if (toml.trim()) {
    try {
      const parsed = parseToml(toml)
      json = JSON.stringify(parsed, null, 2)
      if (error) setError("")
    } catch {
      json = ""
    }
  }

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section">
          <div className="tool-field">
            <label>TOML</label>
            <textarea
              value={toml}
              onChange={e => { setToml(e.target.value); setError("") }}
              rows={14}
              placeholder={'name = "John"\nage = 30\n\n[address]\nstreet = "123 Main St"\ncity = "Anytown"'}
              style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
            />
          </div>
        </div>

        <div className="tool-section">
          <div className="tool-field">
            <label>JSON</label>
            <textarea
              value={json}
              readOnly
              rows={14}
              placeholder="JSON output will appear here..."
              style={{ fontFamily: "monospace", fontSize: "0.82rem", background: "var(--bg-secondary)" }}
            />
          </div>
          {json && (
            <div className="tool-actions">
              <CopyButton text={json} />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        Supports TOML sections, dotted keys, strings, numbers, booleans, and arrays. Complex features (inline tables, datetime, multiline strings) are not supported.
      </p>
    </div>
  )
}
