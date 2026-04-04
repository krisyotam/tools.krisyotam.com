"use client"

import { useState } from "react"

interface Analysis {
  length: number
  hasLower: boolean
  hasUpper: boolean
  hasDigits: boolean
  hasSymbols: boolean
  poolSize: number
  entropy: number
  crackTime: string
  score: number // 0-4
  label: string
}

function analyze(pw: string): Analysis {
  const length = pw.length
  const hasLower = /[a-z]/.test(pw)
  const hasUpper = /[A-Z]/.test(pw)
  const hasDigits = /[0-9]/.test(pw)
  const hasSymbols = /[^a-zA-Z0-9]/.test(pw)

  let poolSize = 0
  if (hasLower) poolSize += 26
  if (hasUpper) poolSize += 26
  if (hasDigits) poolSize += 10
  if (hasSymbols) poolSize += 33

  const entropy = poolSize > 0 ? length * Math.log2(poolSize) : 0

  // Estimated crack time at 10 billion guesses/sec
  const guessesPerSec = 1e10
  const totalGuesses = Math.pow(2, entropy)
  const seconds = totalGuesses / guessesPerSec / 2 // average case

  let crackTime: string
  if (seconds < 1) crackTime = "Instant"
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`
  else if (seconds < 86400 * 365) crackTime = `${Math.round(seconds / 86400)} days`
  else if (seconds < 86400 * 365 * 1000) crackTime = `${Math.round(seconds / (86400 * 365))} years`
  else if (seconds < 86400 * 365 * 1e6) crackTime = `${(seconds / (86400 * 365 * 1000)).toFixed(1)} thousand years`
  else if (seconds < 86400 * 365 * 1e9) crackTime = `${(seconds / (86400 * 365 * 1e6)).toFixed(1)} million years`
  else crackTime = `${(seconds / (86400 * 365 * 1e9)).toFixed(1)} billion years`

  let score: number
  if (entropy < 28) score = 0
  else if (entropy < 36) score = 1
  else if (entropy < 60) score = 2
  else if (entropy < 80) score = 3
  else score = 4

  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"]

  return { length, hasLower, hasUpper, hasDigits, hasSymbols, poolSize, entropy, crackTime, score, label: labels[score] }
}

const METER_COLORS = ["hsl(0 70% 55%)", "hsl(20 70% 50%)", "hsl(45 70% 45%)", "hsl(100 50% 40%)", "hsl(140 50% 40%)"]

export function PasswordStrengthTool() {
  const [password, setPassword] = useState("")
  const result = password ? analyze(password) : null

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter a password to analyze..."
          />
        </div>
      </div>

      {result && (
        <>
          <div className="tool-section">
            <div style={{
              height: "6px",
              background: "var(--bg-tertiary)",
              width: "100%",
              marginBottom: "0.5rem",
            }}>
              <div style={{
                height: "100%",
                width: `${((result.score + 1) / 5) * 100}%`,
                background: METER_COLORS[result.score],
                transition: "width 0.2s, background 0.2s",
              }} />
            </div>
            <p style={{ fontSize: "0.85rem", color: METER_COLORS[result.score], fontWeight: 600 }}>
              {result.label}
            </p>
          </div>

          <div className="tool-section">
            {([
              ["Length", String(result.length)],
              ["Lowercase", result.hasLower ? "Yes" : "No"],
              ["Uppercase", result.hasUpper ? "Yes" : "No"],
              ["Digits", result.hasDigits ? "Yes" : "No"],
              ["Symbols", result.hasSymbols ? "Yes" : "No"],
              ["Character pool", String(result.poolSize)],
              ["Entropy", `${result.entropy.toFixed(1)} bits`],
              ["Estimated crack time", result.crackTime],
            ] as [string, string][]).map(([label, value]) => (
              <div className="tool-output-row" key={label}>
                <span className="tool-output-label">{label}</span>
                <span className="tool-output-value">{value}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
