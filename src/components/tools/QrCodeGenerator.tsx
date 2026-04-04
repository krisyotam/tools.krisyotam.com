"use client"

import { useState } from "react"

export function QrCodeGeneratorTool() {
  const [text, setText] = useState("")
  const [size, setSize] = useState(300)
  const [generated, setGenerated] = useState(false)

  const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`

  const generate = () => {
    if (text.trim()) setGenerated(true)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Text or URL</label>
          <textarea value={text} onChange={e => { setText(e.target.value); setGenerated(false) }} rows={3} placeholder="Enter text or URL to encode..." />
        </div>
        <div className="tool-field">
          <label>Size (px)</label>
          <input type="number" value={size} onChange={e => { setSize(Math.max(50, Math.min(1000, Number(e.target.value)))); setGenerated(false) }} min={50} max={1000} />
        </div>
        <div className="tool-actions">
          <button onClick={generate}>Generate</button>
        </div>
      </div>

      {generated && text.trim() && (
        <div className="tool-section">
          <p className="tool-section-title">QR Code</p>
          <div style={{ textAlign: "center", padding: "1rem", background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}>
            <img src={url} alt="QR Code" style={{ maxWidth: "100%", imageRendering: "pixelated" }} />
          </div>
          <div className="tool-actions" style={{ marginTop: "0.5rem" }}>
            <a href={url} download={`qr-${size}x${size}.png`} target="_blank" rel="noopener noreferrer">
              <button>Download PNG</button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
