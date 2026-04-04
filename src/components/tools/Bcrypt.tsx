"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"
import bcrypt from "bcryptjs"

export function BcryptTool() {
  const [input, setInput] = useState("")
  const [rounds, setRounds] = useState(10)
  const [hashed, setHashed] = useState("")

  const [compareStr, setCompareStr] = useState("")
  const [compareHash, setCompareHash] = useState("")
  const [match, setMatch] = useState<boolean | null>(null)

  const handleHash = () => {
    if (!input) return
    const salt = bcrypt.genSaltSync(rounds)
    setHashed(bcrypt.hashSync(input, salt))
  }

  const handleCompare = () => {
    if (!compareStr || !compareHash) return
    setMatch(bcrypt.compareSync(compareStr, compareHash))
  }

  return (
    <div>
      <div className="tool-section">
        <p className="tool-section-title">Hash</p>
        <div className="tool-field">
          <label>Your string</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="String to hash..." />
        </div>
        <div className="tool-field">
          <label>Salt rounds: {rounds}</label>
          <input
            type="range"
            min={4}
            max={16}
            value={rounds}
            onChange={e => setRounds(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--text-muted)" }}
          />
        </div>
        <div className="tool-actions">
          <button onClick={handleHash}>Hash</button>
        </div>
        {hashed && (
          <div style={{ marginTop: "0.75rem" }}>
            <div className="tool-output-row">
              <span className="tool-output-value" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{hashed}</span>
              <CopyButton text={hashed} />
            </div>
          </div>
        )}
      </div>

      <div className="tool-section">
        <p className="tool-section-title">Compare</p>
        <div className="tool-field">
          <label>Your string</label>
          <input type="text" value={compareStr} onChange={e => setCompareStr(e.target.value)} placeholder="String to compare..." />
        </div>
        <div className="tool-field">
          <label>Your hash</label>
          <input type="text" value={compareHash} onChange={e => setCompareHash(e.target.value)} placeholder="Hash to compare..." />
        </div>
        <div className="tool-actions">
          <button onClick={handleCompare}>Compare</button>
        </div>
        {match !== null && (
          <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: match ? "hsl(142 40% 40%)" : "hsl(0 60% 50%)" }}>
            {match ? "Match — strings are equal." : "No match — strings differ."}
          </p>
        )}
      </div>
    </div>
  )
}
