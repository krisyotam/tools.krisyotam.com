"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function UrlEncoderTool() {
  const [plain, setPlain] = useState("")
  const [encoded, setEncoded] = useState("")
  const [error, setError] = useState("")

  const handlePlain = (text: string) => {
    setPlain(text)
    setError("")
    try { setEncoded(text ? encodeURIComponent(text) : "") }
    catch { setError("Encoding failed"); setEncoded("") }
  }

  const handleEncoded = (text: string) => {
    setEncoded(text)
    setError("")
    try { setPlain(text ? decodeURIComponent(text) : "") }
    catch { setError("Invalid percent-encoded input"); setPlain("") }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Decoded string</label>
          <textarea value={plain} onChange={e => handlePlain(e.target.value)} rows={4} placeholder="Type text to encode..." />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Encoded string</label>
          <textarea value={encoded} onChange={e => handleEncoded(e.target.value)} rows={4} placeholder="Paste encoded text to decode..." />
        </div>
        {encoded && (
          <div className="tool-actions">
            <CopyButton text={encoded} />
          </div>
        )}
      </div>

      {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  )
}
