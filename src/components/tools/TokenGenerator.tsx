"use client"

import { useState, useCallback, useEffect } from "react"
import { CopyButton } from "./CopyButton"

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
}

function generate(length: number, chars: string): string {
  const arr = new Uint32Array(length)
  crypto.getRandomValues(arr)
  return Array.from(arr, v => chars[v % chars.length]).join("")
}

export function TokenGeneratorTool() {
  const [length, setLength] = useState(64)
  const [sets, setSets] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: false })
  const [token, setToken] = useState("")

  const makeToken = useCallback(() => {
    let chars = ""
    if (sets.uppercase) chars += CHARSETS.uppercase
    if (sets.lowercase) chars += CHARSETS.lowercase
    if (sets.numbers) chars += CHARSETS.numbers
    if (sets.symbols) chars += CHARSETS.symbols
    if (!chars) chars = CHARSETS.lowercase + CHARSETS.numbers
    setToken(generate(length, chars))
  }, [length, sets])

  useEffect(() => { makeToken() }, [makeToken])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-toggles">
          {(Object.keys(sets) as (keyof typeof sets)[]).map(key => (
            <label key={key} className="tool-toggle">
              <input
                type="checkbox"
                checked={sets[key]}
                onChange={() => setSets(s => ({ ...s, [key]: !s[key] }))}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <div className="tool-field">
          <label>Length: {length}</label>
          <input
            type="range"
            min={1}
            max={256}
            value={length}
            onChange={e => setLength(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--text-muted)" }}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-output-row">
          <span className="tool-output-value" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
            {token}
          </span>
          <CopyButton text={token} />
        </div>
        <div className="tool-actions">
          <button onClick={makeToken}>Refresh</button>
        </div>
      </div>
    </div>
  )
}
