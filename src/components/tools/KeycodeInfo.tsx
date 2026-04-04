"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "./CopyButton"

interface KeyData {
  key: string
  code: string
  keyCode: number
  which: number
  location: number
  shift: boolean
  ctrl: boolean
  alt: boolean
  meta: boolean
}

const LOCATION_MAP: Record<number, string> = {
  0: "Standard",
  1: "Left",
  2: "Right",
  3: "Numpad",
}

export function KeycodeInfoTool() {
  const [data, setData] = useState<KeyData | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      e.preventDefault()
      setData({
        key: e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        shift: e.shiftKey,
        ctrl: e.ctrlKey,
        alt: e.altKey,
        meta: e.metaKey,
      })
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const modifiers = data
    ? [
        data.shift && "Shift",
        data.ctrl && "Ctrl",
        data.alt && "Alt",
        data.meta && "Meta",
      ].filter(Boolean).join(" + ") || "None"
    : ""

  if (!data) {
    return (
      <div className="tool-section">
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "2rem 0" }}>
          Press any key to see its information.
        </p>
      </div>
    )
  }

  const rows: { label: string; value: string }[] = [
    { label: "Key", value: data.key },
    { label: "Code", value: data.code },
    { label: "keyCode", value: String(data.keyCode) },
    { label: "which", value: String(data.which) },
    { label: "Location", value: LOCATION_MAP[data.location] ?? String(data.location) },
    { label: "Modifiers", value: modifiers },
  ]

  const summary = `key: ${data.key}, code: ${data.code}, keyCode: ${data.keyCode}`

  return (
    <div>
      <div className="tool-section">
        <div style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "2rem",
          fontFamily: "monospace",
          color: "var(--text-primary)",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}>
          {data.key === " " ? "Space" : data.key}
        </div>
      </div>

      <div className="tool-section">
        {rows.map(r => (
          <div className="tool-output-row" key={r.label}>
            <span className="tool-output-label">{r.label}</span>
            <span className="tool-output-value">{r.value}</span>
            <CopyButton text={r.value} />
          </div>
        ))}
      </div>

      <div className="tool-actions">
        <CopyButton text={summary} />
      </div>
    </div>
  )
}
