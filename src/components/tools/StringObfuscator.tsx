"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function StringObfuscatorTool() {
  const [input, setInput] = useState("")
  const [keepFirst, setKeepFirst] = useState(3)
  const [keepLast, setKeepLast] = useState(3)
  const [maskChar, setMaskChar] = useState("\u2022")

  const obfuscate = (s: string): string => {
    if (s.length <= keepFirst + keepLast) return s
    const start = s.slice(0, keepFirst)
    const end = s.slice(s.length - keepLast)
    const mid = maskChar.repeat(s.length - keepFirst - keepLast)
    return start + mid + end
  }

  const lines = input.split("\n").filter(l => l.length > 0)
  const results = lines.map(obfuscate)
  const output = results.join("\n")

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Input (one string per line)</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder={"secret123\nmy-api-key-xyz\njohn@example.com"} />
        </div>
        <div className="tool-field">
          <label>Keep First N</label>
          <input type="number" value={keepFirst} onChange={e => setKeepFirst(Math.max(0, Number(e.target.value)))} min={0} />
        </div>
        <div className="tool-field">
          <label>Keep Last N</label>
          <input type="number" value={keepLast} onChange={e => setKeepLast(Math.max(0, Number(e.target.value)))} min={0} />
        </div>
        <div className="tool-field">
          <label>Mask Character</label>
          <input type="text" value={maskChar} onChange={e => setMaskChar(e.target.value || "\u2022")} maxLength={1} style={{ width: 60 }} />
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Obfuscated</p>
            <CopyButton text={output} />
          </div>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 300,
            margin: 0,
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
