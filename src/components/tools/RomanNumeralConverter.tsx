"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
]

function toRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return ""
  let result = ""
  let remaining = num
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      result += symbol
      remaining -= value
    }
  }
  return result
}

function fromRoman(str: string): number | null {
  const s = str.trim().toUpperCase()
  if (!s || !/^[MDCLXVI]+$/.test(s)) return null

  const map: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }
  let total = 0
  for (let i = 0; i < s.length; i++) {
    const curr = map[s[i]]
    const next = i + 1 < s.length ? map[s[i + 1]] : 0
    if (curr < next) {
      total -= curr
    } else {
      total += curr
    }
  }

  // Validate by converting back
  if (toRoman(total) !== s) return null
  return total
}

export function RomanNumeralConverterTool() {
  const [arabic, setArabic] = useState("")
  const [roman, setRoman] = useState("")
  const [error, setError] = useState("")

  const handleArabic = (val: string) => {
    setArabic(val)
    setError("")
    if (!val.trim()) { setRoman(""); return }
    const n = parseInt(val.trim(), 10)
    if (isNaN(n) || n < 1 || n > 3999) {
      setError("Enter an integer between 1 and 3999")
      setRoman("")
      return
    }
    setRoman(toRoman(n))
  }

  const handleRoman = (val: string) => {
    setRoman(val)
    setError("")
    if (!val.trim()) { setArabic(""); return }
    const n = fromRoman(val)
    if (n === null) {
      setError("Invalid Roman numeral")
      setArabic("")
      return
    }
    setArabic(String(n))
  }

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section">
          <div className="tool-field">
            <label>Arabic number</label>
            <input
              type="text"
              value={arabic}
              onChange={e => handleArabic(e.target.value)}
              placeholder="e.g. 42"
            />
          </div>
          {arabic && !error && (
            <div className="tool-actions">
              <CopyButton text={arabic} />
            </div>
          )}
        </div>

        <div className="tool-section">
          <div className="tool-field">
            <label>Roman numeral</label>
            <input
              type="text"
              value={roman}
              onChange={e => handleRoman(e.target.value)}
              placeholder="e.g. XLII"
              style={{ fontFamily: "monospace" }}
            />
          </div>
          {roman && !error && (
            <div className="tool-actions">
              <CopyButton text={roman} />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  )
}
