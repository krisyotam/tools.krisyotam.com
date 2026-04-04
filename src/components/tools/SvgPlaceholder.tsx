"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "./CopyButton"

export function SvgPlaceholderTool() {
  const [width, setWidth] = useState(640)
  const [height, setHeight] = useState(480)
  const [bgColor, setBgColor] = useState("#cccccc")
  const [textColor, setTextColor] = useState("#666666")
  const [text, setText] = useState("")

  const displayText = text || `${width}\u00D7${height}`

  const svg = useMemo(() => {
    const fontSize = Math.max(12, Math.min(width, height) / 8)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect fill="${bgColor}" width="${width}" height="${height}"/>
  <text fill="${textColor}" font-family="sans-serif" font-size="${fontSize}" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">${displayText}</text>
</svg>`
  }, [width, height, bgColor, textColor, displayText])

  const dataUri = useMemo(() => {
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
  }, [svg])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Width (px)</label>
          <input type="number" value={width} onChange={e => setWidth(Math.max(1, Number(e.target.value)))} min={1} />
        </div>
        <div className="tool-field">
          <label>Height (px)</label>
          <input type="number" value={height} onChange={e => setHeight(Math.max(1, Number(e.target.value)))} min={1} />
        </div>
        <div className="tool-field">
          <label>Background Color</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ flex: 1 }} />
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} style={{ width: 40, height: 36, padding: 2, border: "1px solid var(--border-color)", borderRadius: 0, cursor: "pointer", background: "var(--bg-primary)" }} />
          </div>
        </div>
        <div className="tool-field">
          <label>Text Color</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ flex: 1 }} />
            <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} style={{ width: 40, height: 36, padding: 2, border: "1px solid var(--border-color)", borderRadius: 0, cursor: "pointer", background: "var(--bg-primary)" }} />
          </div>
        </div>
        <div className="tool-field">
          <label>Text (leave empty for dimensions)</label>
          <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={`${width}\u00D7${height}`} />
        </div>
      </div>

      <div className="tool-section">
        <p className="tool-section-title">Preview</p>
        <div style={{ border: "1px solid var(--border-color)", overflow: "auto", maxHeight: 400 }}>
          <img src={dataUri} alt="Placeholder preview" style={{ display: "block", maxWidth: "100%" }} />
        </div>
      </div>

      <div className="tool-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <p className="tool-section-title" style={{ margin: 0 }}>SVG Code</p>
          <CopyButton text={svg} />
        </div>
        <pre style={{
          padding: "0.75rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 0,
          fontSize: "0.76rem",
          overflow: "auto",
          maxHeight: 300,
          margin: 0,
        }}>
          <code>{svg}</code>
        </pre>
      </div>

      <div className="tool-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <p className="tool-section-title" style={{ margin: 0 }}>Data URI</p>
          <CopyButton text={dataUri} />
        </div>
        <pre style={{
          padding: "0.75rem",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          borderRadius: 0,
          fontSize: "0.76rem",
          overflow: "auto",
          maxHeight: 100,
          margin: 0,
          wordBreak: "break-all",
          whiteSpace: "pre-wrap",
        }}>
          <code>{dataUri}</code>
        </pre>
      </div>
    </div>
  )
}
