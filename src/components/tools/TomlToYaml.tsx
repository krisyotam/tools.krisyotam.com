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

    const kvMatch = trimmed.match(/^([^=]+?)\s*=\s*(.+)$/)
    if (kvMatch) {
      const key = kvMatch[1].trim()
      const value = parseTomlValue(kvMatch[2])
      currentSection[key] = value
    }
  }

  return result
}

function toYaml(obj: unknown, indent: number = 0): string {
  const prefix = "  ".repeat(indent)

  if (obj === null) return "null"
  if (typeof obj === "boolean") return obj ? "true" : "false"
  if (typeof obj === "number") return String(obj)
  if (typeof obj === "string") {
    if (
      obj === "" ||
      obj === "true" || obj === "false" ||
      obj === "null" || obj === "~" ||
      /^[\d.+-]/.test(obj) ||
      /[:#\[\]{}&*!|>'"@`]/.test(obj) ||
      obj.includes("\n")
    ) {
      return JSON.stringify(obj)
    }
    return obj
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]"
    return obj
      .map(item => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const inner = toYaml(item, indent + 1)
          const firstLine = inner.split("\n")[0]
          const rest = inner.split("\n").slice(1)
          return [`${prefix}- ${firstLine}`, ...rest].join("\n")
        }
        return `${prefix}- ${toYaml(item, indent + 1)}`
      })
      .join("\n")
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    return entries
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value) && value.length === 0) return `${prefix}${key}: []`
          if (!Array.isArray(value) && Object.keys(value).length === 0) return `${prefix}${key}: {}`
          return `${prefix}${key}:\n${toYaml(value, indent + 1)}`
        }
        return `${prefix}${key}: ${toYaml(value, indent + 1)}`
      })
      .join("\n")
  }

  return String(obj)
}

export function TomlToYamlTool() {
  const [toml, setToml] = useState("")
  const [error, setError] = useState("")

  let yaml = ""
  if (toml.trim()) {
    try {
      const parsed = parseToml(toml)
      yaml = toYaml(parsed)
      if (error) setError("")
    } catch {
      yaml = ""
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
            <label>YAML</label>
            <textarea
              value={yaml}
              readOnly
              rows={14}
              placeholder="YAML output will appear here..."
              style={{ fontFamily: "monospace", fontSize: "0.82rem", background: "var(--bg-secondary)" }}
            />
          </div>
          {yaml && (
            <div className="tool-actions">
              <CopyButton text={yaml} />
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
