"use client"

import { useState } from "react"

export function TextStatisticsTool() {
  const [input, setInput] = useState("")

  const chars = input.length
  const words = input.trim() ? input.trim().split(/\s+/).length : 0
  const sentences = input.trim() ? (input.match(/[.!?]+/g) || []).length || (input.trim() ? 1 : 0) : 0
  const paragraphs = input.trim() ? input.split(/\n\s*\n/).filter(p => p.trim()).length : 0
  const lines = input ? input.split("\n").length : 0
  const bytes = new TextEncoder().encode(input).length
  const readingTime = Math.max(1, Math.ceil(words / 250))

  const stats = [
    ["Characters", chars.toLocaleString()],
    ["Words", words.toLocaleString()],
    ["Sentences", sentences.toLocaleString()],
    ["Paragraphs", paragraphs.toLocaleString()],
    ["Lines", lines.toLocaleString()],
    ["Bytes", bytes.toLocaleString()],
    ["Reading time", `~${readingTime} min`],
  ]

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Your text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={6} placeholder="Paste or type text to analyze..." />
        </div>
      </div>

      <div className="tool-section">
        <p className="tool-section-title">Statistics</p>
        {stats.map(([label, value]) => (
          <div className="tool-output-row" key={label}>
            <span className="tool-output-label">{label}</span>
            <span className="tool-output-value">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
