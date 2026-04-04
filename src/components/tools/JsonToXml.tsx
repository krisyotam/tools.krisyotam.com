"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function jsonToXml(obj: unknown, indent: number = 0, tagName: string = "root"): string {
  const pad = "  ".repeat(indent)
  if (obj === null || obj === undefined) {
    return `${pad}<${tagName} />`
  }
  if (typeof obj === "string" || typeof obj === "number" || typeof obj === "boolean") {
    return `${pad}<${tagName}>${escapeXml(String(obj))}</${tagName}>`
  }
  if (Array.isArray(obj)) {
    return obj.map(item => jsonToXml(item, indent, tagName)).join("\n")
  }
  if (typeof obj === "object") {
    const entries = Object.entries(obj as Record<string, unknown>)
    if (entries.length === 0) {
      return `${pad}<${tagName} />`
    }
    const children = entries.map(([key, value]) => {
      const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "_")
      if (Array.isArray(value)) {
        return value.map(item => jsonToXml(item, indent + 1, safeKey)).join("\n")
      }
      return jsonToXml(value, indent + 1, safeKey)
    }).join("\n")
    return `${pad}<${tagName}>\n${children}\n${pad}</${tagName}>`
  }
  return `${pad}<${tagName}>${String(obj)}</${tagName}>`
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;")
}

export function JsonToXmlTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    if (!input.trim()) { setOutput(""); setError(""); return }
    try {
      const parsed = JSON.parse(input)
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(parsed, 0, "root")}`
      setOutput(xml)
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  return (
    <div>
      <div className="tool-actions" style={{ marginBottom: "0.75rem" }}>
        <button onClick={convert}>Convert to XML</button>
      </div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">JSON Input</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={18}
            placeholder='{"name": "John", "items": [1, 2, 3]}'
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">XML Output</p>
            {output && <CopyButton text={output} />}
          </div>
          {error && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{error}</p>}
          <textarea
            value={output}
            readOnly
            rows={18}
            placeholder="XML output will appear here..."
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)" }}
          />
        </div>
      </div>
    </div>
  )
}
