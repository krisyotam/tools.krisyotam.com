"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "./CopyButton"

function relativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const abs = Math.abs(diff)
  const sign = diff < 0 ? "in " : ""
  const suffix = diff >= 0 ? " ago" : ""

  if (abs < 1000) return "just now"
  if (abs < 60000) return `${sign}${Math.floor(abs / 1000)}s${suffix}`
  if (abs < 3600000) return `${sign}${Math.floor(abs / 60000)}m${suffix}`
  if (abs < 86400000) return `${sign}${Math.floor(abs / 3600000)}h${suffix}`
  if (abs < 2592000000) return `${sign}${Math.floor(abs / 86400000)}d${suffix}`
  if (abs < 31536000000) return `${sign}${Math.floor(abs / 2592000000)}mo${suffix}`
  return `${sign}${Math.floor(abs / 31536000000)}y${suffix}`
}

function parseInput(value: string): Date | null {
  if (!value.trim()) return null

  // Try unix timestamp in seconds (all digits, 9-10 chars)
  if (/^\d{9,10}$/.test(value.trim())) {
    const d = new Date(parseInt(value.trim(), 10) * 1000)
    if (!isNaN(d.getTime())) return d
  }

  // Try unix timestamp in milliseconds (all digits, 13 chars)
  if (/^\d{13}$/.test(value.trim())) {
    const d = new Date(parseInt(value.trim(), 10))
    if (!isNaN(d.getTime())) return d
  }

  // Try Date.parse for everything else (ISO 8601, RFC 2822, etc.)
  const d = new Date(value.trim())
  if (!isNaN(d.getTime())) return d

  return null
}

export function DateTimeConverterTool() {
  const [input, setInput] = useState("")
  const [, setTick] = useState(0)

  const date = parseInput(input)

  // Update relative time every second
  useEffect(() => {
    if (!date) return
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [date])

  const rows: [string, string][] = date
    ? [
        ["Unix (seconds)", String(Math.floor(date.getTime() / 1000))],
        ["Unix (milliseconds)", String(date.getTime())],
        ["ISO 8601", date.toISOString()],
        ["UTC String", date.toUTCString()],
        ["Locale String", date.toLocaleString()],
        ["Relative", relativeTime(date)],
      ]
    : []

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Date, time, or timestamp</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="e.g. 2024-01-15, 1705276800, Jan 15 2024 12:00:00 GMT..."
          />
        </div>
      </div>

      {date && (
        <div className="tool-section">
          <p className="tool-section-title">Conversions</p>
          {rows.map(([label, value]) => (
            <div className="tool-output-row" key={label}>
              <span className="tool-output-label">{label}</span>
              <span className="tool-output-value">{value}</span>
              <CopyButton text={value} />
            </div>
          ))}
        </div>
      )}

      {input && !date && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>
          Could not parse input as a date or timestamp.
        </p>
      )}
    </div>
  )
}
