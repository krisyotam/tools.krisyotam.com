"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function textToBinary(text: string): string {
  return Array.from(text)
    .map(ch => {
      const code = ch.codePointAt(0)!
      return code.toString(2).padStart(code > 127 ? Math.ceil(code.toString(2).length / 8) * 8 : 8, "0")
    })
    .join(" ")
}

function binaryToText(binary: string): string {
  const bytes = binary.trim().split(/\s+/)
  if (bytes.length === 0 || (bytes.length === 1 && bytes[0] === "")) return ""
  return bytes
    .map(b => {
      if (!/^[01]+$/.test(b)) throw new Error("Invalid binary")
      return String.fromCodePoint(parseInt(b, 2))
    })
    .join("")
}

export function TextToBinaryTool() {
  const [text, setText] = useState("")
  const [binary, setBinary] = useState("")
  const [error, setError] = useState("")

  const handleText = (val: string) => {
    setText(val)
    setError("")
    try {
      setBinary(val ? textToBinary(val) : "")
    } catch {
      setError("Encoding failed")
      setBinary("")
    }
  }

  const handleBinary = (val: string) => {
    setBinary(val)
    setError("")
    if (!val.trim()) { setText(""); return }
    try {
      setText(binaryToText(val))
    } catch {
      setError("Invalid binary input (use space-separated bytes of 0s and 1s)")
      setText("")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Text</label>
          <textarea
            value={text}
            onChange={e => handleText(e.target.value)}
            rows={4}
            placeholder="Type text to encode..."
          />
        </div>
        {text && (
          <div className="tool-actions">
            <CopyButton text={text} />
          </div>
        )}
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Binary</label>
          <textarea
            value={binary}
            onChange={e => handleBinary(e.target.value)}
            rows={4}
            placeholder="Paste binary to decode (space-separated bytes)..."
            style={{ fontFamily: "monospace" }}
          />
        </div>
        {binary && (
          <div className="tool-actions">
            <CopyButton text={binary} />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  )
}
