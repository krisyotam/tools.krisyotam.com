"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const encode = (text: string) => {
    setInput(text)
    setError("")
    try {
      setOutput(text ? btoa(unescape(encodeURIComponent(text))) : "")
    } catch { setError("Encoding failed"); setOutput("") }
  }

  const decode = (text: string) => {
    setOutput(text)
    setError("")
    try {
      setInput(text ? decodeURIComponent(escape(atob(text))) : "")
    } catch { setError("Invalid base64 input"); setInput("") }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Plain text</label>
          <textarea value={input} onChange={e => encode(e.target.value)} rows={4} placeholder="Type text to encode..." />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Base64</label>
          <textarea value={output} onChange={e => decode(e.target.value)} rows={4} placeholder="Paste base64 to decode..." />
        </div>
        {output && (
          <div className="tool-actions">
            <CopyButton text={output} />
          </div>
        )}
      </div>

      {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  )
}
