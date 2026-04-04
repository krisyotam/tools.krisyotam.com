"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "./CopyButton"

export function UuidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [uuids, setUuids] = useState<string[]>([])

  const generate = () => setUuids(Array.from({ length: count }, () => crypto.randomUUID()))

  useEffect(() => { generate() }, [])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-row">
          <div className="tool-field">
            <label>Quantity</label>
            <input type="number" value={count} onChange={e => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} min={1} max={100} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button onClick={generate}>Generate</button>
          </div>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="tool-section">
          {uuids.map((u, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-value">{u}</span>
              <CopyButton text={u} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
