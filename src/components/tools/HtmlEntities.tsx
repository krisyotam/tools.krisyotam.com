"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, ch => ENTITIES[ch])
}

function unescapeHtml(text: string): string {
  const el = document.createElement("textarea")
  el.innerHTML = text
  return el.value
}

export function HtmlEntitiesTool() {
  const [plain, setPlain] = useState("")
  const [escaped, setEscaped] = useState("")
  const [error, setError] = useState("")

  const handlePlain = (text: string) => {
    setPlain(text)
    setError("")
    try { setEscaped(text ? escapeHtml(text) : "") }
    catch { setError("Escaping failed"); setEscaped("") }
  }

  const handleEscaped = (text: string) => {
    setEscaped(text)
    setError("")
    try { setPlain(text ? unescapeHtml(text) : "") }
    catch { setError("Unescaping failed"); setPlain("") }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Plain text</label>
          <textarea value={plain} onChange={e => handlePlain(e.target.value)} rows={4} placeholder="Type HTML to escape..." />
        </div>
        {plain && (
          <div className="tool-actions">
            <CopyButton text={plain} />
          </div>
        )}
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Escaped HTML</label>
          <textarea value={escaped} onChange={e => handleEscaped(e.target.value)} rows={4} placeholder="Paste escaped HTML to unescape..." />
        </div>
        {escaped && (
          <div className="tool-actions">
            <CopyButton text={escaped} />
          </div>
        )}
      </div>

      {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  )
}
