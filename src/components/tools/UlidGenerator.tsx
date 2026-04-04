"use client"

import { useState, useCallback, useEffect } from "react"
import { CopyButton } from "./CopyButton"

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"

function encodeTime(time: number, length: number): string {
  let str = ""
  for (let i = length - 1; i >= 0; i--) {
    const mod = time % 32
    str = CROCKFORD[mod] + str
    time = Math.floor(time / 32)
  }
  return str
}

function encodeRandom(length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let str = ""
  for (let i = 0; i < length; i++) {
    str += CROCKFORD[bytes[i] % 32]
  }
  return str
}

function generateUlid(): string {
  const time = Date.now()
  // 10 chars for 48-bit timestamp, 16 chars for 80-bit random
  return encodeTime(time, 10) + encodeRandom(16)
}

export function UlidGeneratorTool() {
  const [count, setCount] = useState(5)
  const [ulids, setUlids] = useState<string[]>([])

  const generate = useCallback(() => {
    const result: string[] = []
    for (let i = 0; i < count; i++) {
      result.push(generateUlid())
    }
    setUlids(result)
  }, [count])

  useEffect(() => { generate() }, [generate])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Count: {count}</label>
          <input
            type="range"
            min={1}
            max={100}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--text-muted)" }}
          />
        </div>
      </div>

      <div className="tool-section">
        {ulids.map((u, i) => (
          <div className="tool-output-row" key={i}>
            <span className="tool-output-value" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{u}</span>
            <CopyButton text={u} />
          </div>
        ))}
        <div className="tool-actions">
          <button onClick={generate}>Refresh</button>
          <CopyButton text={ulids.join("\n")} />
        </div>
      </div>
    </div>
  )
}
