"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function validateIBAN(iban: string): { valid: boolean; country: string; formatted: string; bban: string } | null {
  const clean = iban.replace(/\s/g, "").toUpperCase()
  if (clean.length < 15 || clean.length > 34) return null
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(clean)) return null

  const country = clean.slice(0, 2)
  const checkDigits = clean.slice(2, 4)
  const bban = clean.slice(4)

  // MOD-97 validation: move first 4 chars to end, convert letters to numbers
  const rearranged = clean.slice(4) + clean.slice(0, 4)
  const numeric = rearranged.replace(/[A-Z]/g, ch => String(ch.charCodeAt(0) - 55))

  // Compute mod 97 on the large number using string chunking
  let remainder = ""
  for (const char of numeric) {
    remainder += char
    const num = parseInt(remainder, 10)
    remainder = String(num % 97)
  }

  const valid = parseInt(remainder, 10) === 1
  const formatted = clean.replace(/(.{4})/g, "$1 ").trim()

  return { valid, country, formatted, bban }
}

const COUNTRY_NAMES: Record<string, string> = {
  DE: "Germany", FR: "France", GB: "United Kingdom", ES: "Spain", IT: "Italy",
  NL: "Netherlands", BE: "Belgium", AT: "Austria", CH: "Switzerland", IE: "Ireland",
  PT: "Portugal", FI: "Finland", SE: "Sweden", DK: "Denmark", NO: "Norway",
  PL: "Poland", CZ: "Czech Republic", GR: "Greece", HU: "Hungary", RO: "Romania",
  BG: "Bulgaria", HR: "Croatia", LT: "Lithuania", LV: "Latvia", EE: "Estonia",
  SK: "Slovakia", SI: "Slovenia", LU: "Luxembourg", MT: "Malta", CY: "Cyprus",
  TR: "Turkey", SA: "Saudi Arabia", AE: "UAE", IL: "Israel",
}

export function IbanValidatorTool() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<ReturnType<typeof validateIBAN>>(null)
  const [error, setError] = useState("")

  const validate = () => {
    setError("")
    const r = validateIBAN(input)
    if (!r) {
      setError("Invalid IBAN format. Must be 15-34 characters starting with a 2-letter country code.")
      setResult(null)
      return
    }
    setResult(r)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>IBAN</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="DE89 3704 0044 0532 0130 00" style={{ fontFamily: "monospace" }} onKeyDown={e => { if (e.key === "Enter") validate() }} />
        </div>
        <div className="tool-actions">
          <button onClick={validate}>Validate</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {result && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span className="tool-output-label">Valid</span>
            <span className="tool-output-value" style={{ color: result.valid ? "hsl(120 40% 40%)" : "hsl(0 70% 55%)" }}>
              {result.valid ? "Yes" : "No (checksum failed)"}
            </span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Country</span>
            <span className="tool-output-value">{COUNTRY_NAMES[result.country] || result.country} ({result.country})</span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Formatted</span>
            <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{result.formatted}</span>
            <CopyButton text={result.formatted} />
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">BBAN</span>
            <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{result.bban}</span>
            <CopyButton text={result.bban} />
          </div>
        </div>
      )}
    </div>
  )
}
