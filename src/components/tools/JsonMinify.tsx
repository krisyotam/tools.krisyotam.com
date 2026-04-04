"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function JsonMinifyTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

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
          <label>JSON Input</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={8} placeholder='Paste your JSON here...' />
        </div>
        <div className="tool-actions">
          <button onClick={minify}>Minify</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Minified</p>
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
            wordBreak: "break-all",
            whiteSpace: "pre-wrap",
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
