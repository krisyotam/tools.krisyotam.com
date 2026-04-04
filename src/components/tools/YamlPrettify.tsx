"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function jsonToYaml(obj: unknown, indent: number = 0): string {
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

export function YamlPrettifyTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    setError("")
    setOutput("")
    try {
      const parsed = JSON.parse(input)
      setOutput(jsonToYaml(parsed))
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>JSON input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={10}
            placeholder={'{\n  "server": {\n    "host": "0.0.0.0",\n    "port": 8080\n  },\n  "database": {\n    "url": "postgres://localhost/db"\n  }\n}'}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
        <div className="tool-actions">
          <button onClick={convert}>Convert to YAML</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>YAML output</p>
            <CopyButton text={output} />
          </div>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 400,
            margin: 0,
            fontFamily: "monospace",
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
