"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function JsonPrettifyTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indent, setIndent] = useState(2)

  const prettify = () => {
    setError("")
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, indent))
    } catch (e: any) {
      setError(e.message)
      setOutput("")
    }
  }

  const minify = () => {
    setError("")
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
    } catch (e: any) {
      setError(e.message)
      setOutput("")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Raw JSON</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder='{"key": "value", ...}' />
        </div>
        <div className="tool-row" style={{ alignItems: "center" }}>
          <div className="tool-field" style={{ maxWidth: 120, marginBottom: 0 }}>
            <label>Indent</label>
            <input type="number" value={indent} onChange={e => setIndent(Number(e.target.value))} min={1} max={8} />
          </div>
          <div className="tool-actions" style={{ marginTop: 0 }}>
            <button onClick={prettify}>Prettify</button>
            <button onClick={minify}>Minify</button>
          </div>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Result</p>
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
