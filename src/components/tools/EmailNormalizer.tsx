"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function normalizeEmail(email: string): string {
  const trimmed = email.trim().toLowerCase()
  const atIdx = trimmed.lastIndexOf("@")
  if (atIdx === -1) return trimmed

  let local = trimmed.slice(0, atIdx)
  const domain = trimmed.slice(atIdx + 1)

  // Remove +suffix
  const plusIdx = local.indexOf("+")
  if (plusIdx !== -1) local = local.slice(0, plusIdx)

  // Remove dots for Gmail
  const gmailDomains = ["gmail.com", "googlemail.com"]
  if (gmailDomains.includes(domain)) {
    local = local.replace(/\./g, "")
  }

  return `${local}@${domain}`
}

export function EmailNormalizerTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const normalize = () => {
    const lines = input.split("\n").map(l => l.trim()).filter(Boolean)
    const normalized = lines.map(normalizeEmail)
    setOutput(normalized.join("\n"))
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Email Addresses (one per line)</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} placeholder={"John.Doe+newsletter@Gmail.com\nuser.name+tag@example.com"} />
        </div>
        <div className="tool-actions">
          <button onClick={normalize}>Normalize</button>
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Normalized</p>
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
