"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

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

export function JsonToTomlTool() {
  const [json, setJson] = useState("")
  const [error, setError] = useState("")

  let toml = ""
  if (json.trim()) {
    try {
      const parsed = JSON.parse(json)
      toml = objectToToml(parsed).trim()
      if (error) setError("")
    } catch {
      toml = ""
    }
  }

  const hasParseError = json.trim() && !toml

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section">
          <div className="tool-field">
            <label>JSON</label>
            <textarea
              value={json}
              onChange={e => { setJson(e.target.value); setError("") }}
              rows={14}
              placeholder={'{\n  "name": "John",\n  "age": 30,\n  "address": {\n    "street": "123 Main St"\n  }\n}'}
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

      {hasParseError && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>
          Invalid JSON input
        </p>
      )}

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  )
}
