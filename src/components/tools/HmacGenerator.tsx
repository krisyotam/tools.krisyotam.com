"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const ALGORITHMS = ["SHA-256", "SHA-384", "SHA-512"] as const

async function computeHmac(message: string, secret: string, algorithm: string): Promise<string> {
  const enc = new TextEncoder()
  const keyData = enc.encode(secret)
  const msgData = enc.encode(message)

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: algorithm },
    false,
    ["sign"]
  )

  const sig = await crypto.subtle.sign("HMAC", key, msgData)
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}

export function HmacGeneratorTool() {
  const [message, setMessage] = useState("")
  const [secret, setSecret] = useState("")
  const [algorithm, setAlgorithm] = useState<string>("SHA-256")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const handleCompute = async () => {
    if (!message || !secret) { setError("Both message and secret key are required."); setResult(""); return }
    setError("")
    try {
      const hex = await computeHmac(message, secret, algorithm)
      setResult(hex)
    } catch (e) {
      setError("HMAC computation failed.")
      setResult("")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Message</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
            placeholder="The message to authenticate..."
          />
        </div>
        <div className="tool-field">
          <label>Secret key</label>
          <input
            type="text"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            placeholder="Your secret key"
          />
        </div>
        <div className="tool-field">
          <label>Algorithm</label>
          <select value={algorithm} onChange={e => setAlgorithm(e.target.value)}>
            {ALGORITHMS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div className="tool-actions">
          <button onClick={handleCompute}>Compute HMAC</button>
        </div>
      </div>

      {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}

      {result && (
        <div className="tool-section">
          <p className="tool-section-title">HMAC digest</p>
          <div className="tool-output-row">
            <span className="tool-output-value" style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{result}</span>
            <CopyButton text={result} />
          </div>
        </div>
      )}
    </div>
  )
}
