"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function ipToNum(ip: string): number {
  const parts = ip.split(".").map(Number)
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
}

function numToIp(n: number): string {
  return [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff].join(".")
}

export function Ipv4SubnetCalculatorTool() {
  const [input, setInput] = useState("192.168.1.0/24")
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")
    setResult(null)
    const match = input.trim().match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/)
    if (!match) { setError("Enter a valid IP/CIDR (e.g. 192.168.1.0/24)"); return }
    const ip = match[1]
    const cidr = parseInt(match[2])
    if (cidr < 0 || cidr > 32) { setError("CIDR must be between 0 and 32"); return }
    const parts = ip.split(".").map(Number)
    if (parts.some(p => p < 0 || p > 255)) { setError("Each octet must be 0-255"); return }

    const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0
    const ipNum = ipToNum(ip)
    const network = (ipNum & mask) >>> 0
    const broadcast = (network | (~mask >>> 0)) >>> 0
    const firstHost = cidr >= 31 ? network : network + 1
    const lastHost = cidr >= 31 ? broadcast : broadcast - 1
    const totalHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : broadcast - network - 1
    const wildcard = (~mask) >>> 0

    setResult({
      "Network Address": numToIp(network),
      "Broadcast Address": numToIp(broadcast),
      "Subnet Mask": numToIp(mask),
      "Wildcard Mask": numToIp(wildcard),
      "First Host": numToIp(firstHost),
      "Last Host": numToIp(lastHost),
      "Total Hosts": String(totalHosts),
      "CIDR": `/${cidr}`,
    })
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>IP / CIDR</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="192.168.1.0/24" />
        </div>
        <div className="tool-actions">
          <button onClick={calculate}>Calculate</button>
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
