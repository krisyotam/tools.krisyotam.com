"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface ParsedPhone {
  raw: string
  countryCode: string
  national: string
  international: string
  e164: string
  country: string
}

function parsePhone(input: string): ParsedPhone | null {
  const digits = input.replace(/[^\d+]/g, "")
  const clean = digits.replace(/\D/g, "")
  if (clean.length < 7 || clean.length > 15) return null

  // US/Canada: 1 + 10 digits or just 10 digits
  if ((clean.length === 11 && clean.startsWith("1")) || clean.length === 10) {
    const nat = clean.length === 11 ? clean.slice(1) : clean
    const area = nat.slice(0, 3)
    const mid = nat.slice(3, 6)
    const last = nat.slice(6)
    return {
      raw: input,
      countryCode: "+1",
      national: `(${area}) ${mid}-${last}`,
      international: `+1 ${area} ${mid} ${last}`,
      e164: `+1${nat}`,
      country: "US/CA",
    }
  }

  // UK: 44 + 10 digits
  if (clean.startsWith("44") && (clean.length === 12 || clean.length === 13)) {
    const nat = clean.slice(2)
    const formatted = nat.startsWith("7") ? `0${nat.slice(0, 4)} ${nat.slice(4)}` : `0${nat.slice(0, 3)} ${nat.slice(3, 7)} ${nat.slice(7)}`
    return {
      raw: input,
      countryCode: "+44",
      national: formatted,
      international: `+44 ${nat}`,
      e164: `+44${nat}`,
      country: "UK",
    }
  }

  // Generic: assume first 1-3 digits are country code
  if (clean.length >= 11) {
    // Try 2-digit country code
    const cc = clean.slice(0, 2)
    const nat = clean.slice(2)
    return {
      raw: input,
      countryCode: `+${cc}`,
      national: nat,
      international: `+${cc} ${nat}`,
      e164: `+${cc}${nat}`,
      country: "Unknown",
    }
  }

  // Fallback: treat as local
  return {
    raw: input,
    countryCode: "",
    national: clean,
    international: clean,
    e164: clean,
    country: "Unknown",
  }
}

export function PhoneParserTool() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<ParsedPhone | null>(null)
  const [error, setError] = useState("")

  const parse = () => {
    setError("")
    const parsed = parsePhone(input)
    if (!parsed) {
      setError("Could not parse phone number. Enter 7-15 digits.")
      setResult(null)
      return
    }
    setResult(parsed)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Phone Number</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="+1 (555) 123-4567" onKeyDown={e => { if (e.key === "Enter") parse() }} />
        </div>
        <div className="tool-actions">
          <button onClick={parse}>Parse</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {result && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span className="tool-output-label">Country</span>
            <span className="tool-output-value">{result.country}</span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Country Code</span>
            <span className="tool-output-value">{result.countryCode}</span>
            <CopyButton text={result.countryCode} />
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">National</span>
            <span className="tool-output-value">{result.national}</span>
            <CopyButton text={result.national} />
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">International</span>
            <span className="tool-output-value">{result.international}</span>
            <CopyButton text={result.international} />
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">E.164</span>
            <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{result.e164}</span>
            <CopyButton text={result.e164} />
          </div>
        </div>
      )}
    </div>
  )
}
