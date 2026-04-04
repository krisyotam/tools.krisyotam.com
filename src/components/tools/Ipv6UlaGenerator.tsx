"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes)
  crypto.getRandomValues(arr)
  return Array.from(arr).map(b => b.toString(16).padStart(2, "0")).join("")
}

function formatIpv6Group(hex: string): string {
  // Split into 4-char groups
  const groups: string[] = []
  for (let i = 0; i < hex.length; i += 4) {
    groups.push(hex.slice(i, i + 4))
  }
  return groups.join(":")
}

interface UlaResult {
  prefix48: string
  prefix64: string
  firstAddress: string
  lastAddress: string
  globalId: string
  subnetId: string
}

function generateUla(): UlaResult {
  // RFC 4193: fd + 40-bit random global ID + 16-bit subnet ID
  const globalIdHex = randomHex(5) // 40 bits = 5 bytes
  const subnetIdHex = randomHex(2) // 16 bits = 2 bytes

  // Full prefix: fd + globalId (10 hex chars) = fd## #### ####
  const prefix48Hex = "fd" + globalIdHex // 12 hex chars = 48 bits
  const prefix64Hex = prefix48Hex + subnetIdHex // 16 hex chars = 64 bits

  const prefix48 = formatIpv6Group(prefix48Hex.padEnd(32, "0"))
  const prefix64 = formatIpv6Group(prefix64Hex.padEnd(32, "0"))
  const firstAddr = formatIpv6Group(prefix64Hex + "0000000000000001")
  const lastAddr = formatIpv6Group(prefix64Hex + "ffffffffffffffff")

  // Format the /48 and /64 in compressed form
  const p48Display = formatIpv6Group(prefix48Hex.padEnd(8, "0")).replace(/:0000/g, "").replace(/^(.+?)(?::0+)*$/, "$1")
  const p64Display = formatIpv6Group(prefix64Hex.padEnd(8, "0"))

  return {
    prefix48: `fd${globalIdHex.slice(0, 2)}:${globalIdHex.slice(2, 6)}:${globalIdHex.slice(6, 10)}::/48`,
    prefix64: `fd${globalIdHex.slice(0, 2)}:${globalIdHex.slice(2, 6)}:${globalIdHex.slice(6, 10)}:${subnetIdHex}::/64`,
    firstAddress: `fd${globalIdHex.slice(0, 2)}:${globalIdHex.slice(2, 6)}:${globalIdHex.slice(6, 10)}:${subnetIdHex}::1`,
    lastAddress: `fd${globalIdHex.slice(0, 2)}:${globalIdHex.slice(2, 6)}:${globalIdHex.slice(6, 10)}:${subnetIdHex}:ffff:ffff:ffff:ffff`,
    globalId: globalIdHex,
    subnetId: subnetIdHex,
  }
}

export function Ipv6UlaGeneratorTool() {
  const [result, setResult] = useState<UlaResult | null>(null)

  const generate = () => {
    setResult(generateUla())
  }

  const rows = result
    ? [
        { label: "/48 Prefix", value: result.prefix48 },
        { label: "/64 Prefix", value: result.prefix64 },
        { label: "First address", value: result.firstAddress },
        { label: "Last address", value: result.lastAddress },
        { label: "Global ID", value: result.globalId },
        { label: "Subnet ID", value: result.subnetId },
      ]
    : []

  return (
    <div>
      <div className="tool-section">
        <div className="tool-actions">
          <button onClick={generate}>Generate ULA</button>
        </div>
      </div>

      {result && (
        <div className="tool-section">
          <p className="tool-section-title">Generated ULA</p>
          {rows.map(r => (
            <div className="tool-output-row" key={r.label}>
              <span className="tool-output-label">{r.label}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{r.value}</span>
              <CopyButton text={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
