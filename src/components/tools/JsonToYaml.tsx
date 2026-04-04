"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function jsonToYaml(obj: unknown, indent: number = 0): string {
  const prefix = "  ".repeat(indent)

  if (obj === null) return "null"
  if (typeof obj === "boolean") return obj ? "true" : "false"
  if (typeof obj === "number") return String(obj)
  if (typeof obj === "string") {
    // Quote strings that could be confused with other YAML types
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
          const inner = jsonToYaml(item, indent + 1)
          const firstLine = inner.split("\n")[0]
          const rest = inner.split("\n").slice(1)
          const lines = [`${prefix}- ${firstLine}`, ...rest]
          return lines.join("\n")
        }
        return `${prefix}- ${jsonToYaml(item, indent + 1)}`
      })
      .join("\n")
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) return "{}"
    return entries
      .map(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value) && value.length === 0) {
            return `${prefix}${key}: []`
          }
          if (!Array.isArray(value) && Object.keys(value).length === 0) {
            return `${prefix}${key}: {}`
          }
          return `${prefix}${key}:\n${jsonToYaml(value, indent + 1)}`
        }
        return `${prefix}${key}: ${jsonToYaml(value, indent + 1)}`
      })
      .join("\n")
  }

  return String(obj)
}

export function JsonToYamlTool() {
  const [json, setJson] = useState("")
  const [error, setError] = useState("")

  let yaml = ""
  if (json.trim()) {
    try {
      const parsed = JSON.parse(json)
      yaml = jsonToYaml(parsed)
    } catch {
      yaml = ""
      if (json.trim()) {
        // Only show error if there's non-empty input
      }
    }
  }

  const hasParseError = json.trim() && !yaml

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
