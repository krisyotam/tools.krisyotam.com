"use client"

import { useState, useCallback } from "react"
import { CopyButton } from "./CopyButton"

function randomPort(): number {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return 1024 + (arr[0] % (65535 - 1024 + 1))
}

export function RandomPortGeneratorTool() {
  const [count, setCount] = useState(5)
  const [ports, setPorts] = useState<number[]>([])

  const generate = useCallback(() => {
    const result: number[] = []
    const seen = new Set<number>()
    while (result.length < count) {
      const p = randomPort()
      if (!seen.has(p)) {
        seen.add(p)
        result.push(p)
      }
    }
    setPorts(result)
  }, [count])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Count</label>
          <input
            type="number"
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
            min={1}
            max={100}
          />
        </div>
        <div className="tool-actions">
          <button onClick={generate}>Generate</button>
        </div>
      </div>

      {ports.length > 0 && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Ports</p>
            <CopyButton text={ports.join("\n")} />
          </div>
          {ports.map((port, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-value">{port}</span>
              <CopyButton text={String(port)} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
