"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function ipToNum(ip: string): number | null {
  const parts = ip.trim().split(".")
  if (parts.length !== 4) return null
  let num = 0
  for (const p of parts) {
    const n = parseInt(p, 10)
    if (isNaN(n) || n < 0 || n > 255) return null
    num = (num * 256) + n
  }
  return num >>> 0
}

function numToIp(num: number): string {
  return [
    (num >>> 24) & 0xff,
    (num >>> 16) & 0xff,
    (num >>> 8) & 0xff,
    num & 0xff,
  ].join(".")
}

function prefixToMask(prefix: number): number {
  if (prefix === 0) return 0
  return (~0 << (32 - prefix)) >>> 0
}

function maskToPrefix(mask: number): number {
  let count = 0
  let m = mask >>> 0
  while (m & 0x80000000) {
    count++
    m = (m << 1) >>> 0
  }
  return count
}

interface CidrBlock {
  cidr: string
  network: string
  broadcast: string
  mask: string
  prefix: number
  hostCount: number
}

function expandRange(startIp: string, endIp: string): CidrBlock[] {
  const start = ipToNum(startIp)
  const end = ipToNum(endIp)
  if (start === null || end === null || start > end) return []

  const blocks: CidrBlock[] = []
  let current = start

  while (current <= end) {
    // Find the largest block starting at current that fits within the range
    let bestPrefix = 32
    for (let prefix = 32; prefix >= 0; prefix--) {
      const mask = prefixToMask(prefix)
      const network = (current & mask) >>> 0
      const broadcast = (network | (~mask >>> 0)) >>> 0

      // The network address must equal current (aligned)
      if (network !== current) continue
      // The broadcast must not exceed end
      if (broadcast > end) continue

      bestPrefix = prefix
      break
    }

    const mask = prefixToMask(bestPrefix)
    const network = (current & mask) >>> 0
    const broadcast = (network | (~mask >>> 0)) >>> 0
    const hostCount = broadcast - network + 1

    blocks.push({
      cidr: `${numToIp(network)}/${bestPrefix}`,
      network: numToIp(network),
      broadcast: numToIp(broadcast),
      mask: numToIp(mask),
      prefix: bestPrefix,
      hostCount,
    })

    current = broadcast + 1
    // Overflow check
    if (current === 0 && broadcast === 0xffffffff) break
  }

  return blocks
}

export function Ipv4RangeExpanderTool() {
  const [startIp, setStartIp] = useState("")
  const [endIp, setEndIp] = useState("")
  const [blocks, setBlocks] = useState<CidrBlock[]>([])
  const [error, setError] = useState("")

  const calculate = () => {
    setError("")
    setBlocks([])

    if (ipToNum(startIp) === null) { setError("Invalid start IP"); return }
    if (ipToNum(endIp) === null) { setError("Invalid end IP"); return }
    if (ipToNum(startIp)! > ipToNum(endIp)!) { setError("Start IP must be less than or equal to end IP"); return }

    const result = expandRange(startIp, endIp)
    setBlocks(result)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Start IP</label>
          <input
            type="text"
            value={startIp}
            onChange={e => setStartIp(e.target.value)}
            placeholder="192.168.1.0"
          />
        </div>
        <div className="tool-field">
          <label>End IP</label>
          <input
            type="text"
            value={endIp}
            onChange={e => setEndIp(e.target.value)}
            placeholder="192.168.1.255"
          />
        </div>
        <div className="tool-actions">
          <button onClick={calculate}>Calculate</button>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      {blocks.map((block, i) => (
        <div className="tool-section" key={i}>
          <p className="tool-section-title">Block {blocks.length > 1 ? i + 1 : ""}</p>
          {[
            { label: "CIDR", value: block.cidr },
            { label: "Network", value: block.network },
            { label: "Broadcast", value: block.broadcast },
            { label: "Subnet mask", value: block.mask },
            { label: "Prefix length", value: `/${block.prefix}` },
            { label: "Addresses", value: block.hostCount.toLocaleString() },
          ].map(r => (
            <div className="tool-output-row" key={r.label}>
              <span className="tool-output-label">{r.label}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{r.value}</span>
              <CopyButton text={r.value} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
