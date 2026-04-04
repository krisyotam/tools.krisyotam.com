"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function textToUnicode(text: string): string {
  return Array.from(text)
    .map(ch => {
      const cp = ch.codePointAt(0)!
      return "U+" + cp.toString(16).toUpperCase().padStart(4, "0")
    })
    .join(" ")
}

function unicodeToText(unicode: string): string {
  const tokens = unicode.trim().split(/\s+/)
  if (tokens.length === 0 || (tokens.length === 1 && tokens[0] === "")) return ""
  return tokens
    .map(t => {
      const hex = t.replace(/^U\+/i, "")
      if (!/^[0-9a-fA-F]{1,6}$/.test(hex)) throw new Error("Invalid code point")
      const cp = parseInt(hex, 16)
      if (cp > 0x10FFFF) throw new Error("Code point out of range")
      return String.fromCodePoint(cp)
    })
    .join("")
}

export function TextToUnicodeTool() {
  const [text, setText] = useState("")
  const [unicode, setUnicode] = useState("")
  const [error, setError] = useState("")

  const handleText = (val: string) => {
    setText(val)
    setError("")
    try {
      setUnicode(val ? textToUnicode(val) : "")
    } catch {
      setError("Encoding failed")
      setUnicode("")
    }
  }

  const handleUnicode = (val: string) => {
    setUnicode(val)
    setError("")
    if (!val.trim()) { setText(""); return }
    try {
      setText(unicodeToText(val))
    } catch {
      setError("Invalid code points (use U+XXXX format, space-separated)")
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
            placeholder="Type text to convert..."
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
          <label>Unicode code points</label>
          <textarea
            value={unicode}
            onChange={e => handleUnicode(e.target.value)}
            rows={4}
            placeholder="e.g. U+0048 U+0065 U+006C U+006C U+006F"
            style={{ fontFamily: "monospace" }}
          />
        </div>
        {unicode && (
          <div className="tool-actions">
            <CopyButton text={unicode} />
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  )
}
