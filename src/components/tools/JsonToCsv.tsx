"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function escCsv(val: unknown): string {
  const s = val == null ? "" : String(val)
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export function JsonToCsvTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    setError("")
    try {
      const parsed = JSON.parse(input)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError("Input must be a non-empty JSON array of objects.")
        setOutput("")
        return
      }
      const headers = Array.from(new Set(parsed.flatMap(obj => Object.keys(obj))))
      const rows = parsed.map(obj => headers.map(h => escCsv(obj[h])).join(","))
      setOutput([headers.map(h => escCsv(h)).join(","), ...rows].join("\n"))
    } catch (e: any) {
      setError(e.message)
      setOutput("")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>JSON Array</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder='[{"name": "Alice", "age": 30}, ...]' />
        </div>
        <div className="tool-actions">
          <button onClick={convert}>Convert to CSV</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>CSV Output</p>
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
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
