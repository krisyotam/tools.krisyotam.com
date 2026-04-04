"use client"

import { useState, useCallback } from "react"
import { CopyButton } from "./CopyButton"

function randomMac(sep: string, upper: boolean): string {
  const bytes = new Uint8Array(6)
  crypto.getRandomValues(bytes)
  const hex = Array.from(bytes, b => b.toString(16).padStart(2, "0"))
  const joined = hex.join(sep)
  return upper ? joined.toUpperCase() : joined
}

export function MacAddressGeneratorTool() {
  const [count, setCount] = useState(5)
  const [sep, setSep] = useState(":")
  const [upper, setUpper] = useState(false)
  const [macs, setMacs] = useState<string[]>([])

  const generate = useCallback(() => {
    setMacs(Array.from({ length: count }, () => randomMac(sep, upper)))
  }, [count, sep, upper])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Count</label>
          <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))} min={1} max={100} />
        </div>
        <div className="tool-field">
          <label>Separator</label>
          <select value={sep} onChange={e => setSep(e.target.value)}>
            <option value=":">Colon (:)</option>
            <option value="-">Hyphen (-)</option>
            <option value=".">Dot (.)</option>
          </select>
        </div>
        <div className="tool-toggles">
          <label className="tool-toggle">
            <input type="checkbox" checked={upper} onChange={() => setUpper(u => !u)} />
            Uppercase
          </label>
        </div>
        <div className="tool-actions">
          <button onClick={generate}>Generate</button>
        </div>
      </div>

      {macs.length > 0 && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>MAC Addresses</p>
            <CopyButton text={macs.join("\n")} />
          </div>
          {macs.map((mac, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{mac}</span>
              <CopyButton text={mac} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
