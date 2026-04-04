"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function ipToNum(ip: string): number | null {
  const parts = ip.trim().split(".")
  if (parts.length !== 4) return null
  const nums = parts.map(Number)
  if (nums.some(n => isNaN(n) || n < 0 || n > 255)) return null
  return ((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0
}

function numToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".")
}

function numToBin(n: number): string {
  return [24, 16, 8, 0].map(s => ((n >>> s) & 0xff).toString(2).padStart(8, "0")).join(".")
}

function numToHex(n: number): string {
  return "0x" + n.toString(16).padStart(8, "0").toUpperCase()
}

function parseInput(input: string): number | null {
  const trimmed = input.trim()
  // Dotted decimal
  const ipNum = ipToNum(trimmed)
  if (ipNum !== null) return ipNum
  // Hex
  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    const n = parseInt(trimmed, 16)
    if (n >= 0 && n <= 0xFFFFFFFF) return n >>> 0
  }
  // Binary with dots
  if (/^[01]{8}\.[01]{8}\.[01]{8}\.[01]{8}$/.test(trimmed)) {
    const parts = trimmed.split(".").map(b => parseInt(b, 2))
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
  }
  // Integer
  const n = parseInt(trimmed, 10)
  if (!isNaN(n) && n >= 0 && n <= 0xFFFFFFFF && String(n) === trimmed) return n >>> 0
  return null
}

export function Ipv4AddressConverterTool() {
  const [input, setInput] = useState("192.168.1.1")
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState("")

  const convert = () => {
    setError("")
    const num = parseInput(input)
    if (num === null) {
      setError("Enter a valid IPv4 in dotted decimal, binary, hex, or integer form.")
      setResult(null)
      return
    }
    setResult({
      "Dotted Decimal": numToIp(num),
      "Binary": numToBin(num),
      "Hexadecimal": numToHex(num),
      "Integer": String(num),
    })
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>IPv4 Address</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="192.168.1.1 or 0xC0A80101 or 3232235777" />
        </div>
        <div className="tool-actions">
          <button onClick={convert}>Convert</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {result && (
        <div className="tool-section">
          {Object.entries(result).map(([k, v]) => (
            <div className="tool-output-row" key={k}>
              <span className="tool-output-label">{k}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{v}</span>
              <CopyButton text={v} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
