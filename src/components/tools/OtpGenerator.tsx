"use client"

import { useState, useEffect, useCallback } from "react"
import { CopyButton } from "./CopyButton"

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

function base32Decode(input: string): Uint8Array {
  const cleaned = input.replace(/[\s=]/g, "").toUpperCase()
  let bits = ""
  for (const c of cleaned) {
    const idx = BASE32_CHARS.indexOf(c)
    if (idx === -1) throw new Error(`Invalid base32 character: ${c}`)
    bits += idx.toString(2).padStart(5, "0")
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8))
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, i * 8 + 8), 2)
  }
  return bytes
}

function generateRandomSecret(length: number = 20): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  let result = ""
  let buffer = 0
  let bitsLeft = 0
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte
    bitsLeft += 8
    while (bitsLeft >= 5) {
      bitsLeft -= 5
      result += BASE32_CHARS[(buffer >> bitsLeft) & 0x1f]
    }
  }
  if (bitsLeft > 0) {
    result += BASE32_CHARS[(buffer << (5 - bitsLeft)) & 0x1f]
  }
  return result
}

async function hmacSha1(key: Uint8Array, message: Uint8Array): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, message)
  return new Uint8Array(sig)
}

async function generateTOTP(secret: string, period: number = 30, digits: number = 6): Promise<string> {
  const key = base32Decode(secret)
  const time = Math.floor(Date.now() / 1000 / period)
  const timeBytes = new Uint8Array(8)
  let t = time
  for (let i = 7; i >= 0; i--) {
    timeBytes[i] = t & 0xff
    t = Math.floor(t / 256)
  }
  const hash = await hmacSha1(key, timeBytes)
  const offset = hash[hash.length - 1] & 0x0f
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff)
  const otp = (code % Math.pow(10, digits)).toString().padStart(digits, "0")
  return otp
}

export function OtpGeneratorTool() {
  const [secret, setSecret] = useState("")
  const [code, setCode] = useState("")
  const [timeLeft, setTimeLeft] = useState(30)
  const [error, setError] = useState("")

  const computeCode = useCallback(async () => {
    if (!secret.trim()) {
      setCode("")
      setError("")
      return
    }
    try {
      const otp = await generateTOTP(secret.trim())
      setCode(otp)
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setCode("")
    }
  }, [secret])

  useEffect(() => {
    computeCode()
    const interval = setInterval(() => {
      const remaining = 30 - (Math.floor(Date.now() / 1000) % 30)
      setTimeLeft(remaining)
      if (remaining === 30) {
        computeCode()
      }
    }, 200)
    return () => clearInterval(interval)
  }, [computeCode])

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Secret Key</p>
          <div className="tool-field">
            <label>Base32 Secret</label>
            <input
              type="text"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="JBSWY3DPEHPK3PXP"
              style={{ fontFamily: "monospace" }}
            />
          </div>
          <div className="tool-actions">
            <button onClick={() => setSecret(generateRandomSecret())}>Generate Random Secret</button>
          </div>
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">TOTP Code</p>
          {error && <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{error}</p>}
          {code && !error && (
            <>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                padding: "1.5rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}>
                <span style={{
                  fontFamily: "monospace",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  color: "var(--text-primary)",
                }}>
                  {code}
                </span>
                <CopyButton text={code} />
              </div>
              <div style={{
                marginTop: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}>
                <div style={{
                  flex: 1,
                  height: "4px",
                  background: "var(--border-color)",
                  position: "relative",
                }}>
                  <div style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    width: `${(timeLeft / 30) * 100}%`,
                    background: "var(--text-muted)",
                    transition: "width 0.2s linear",
                  }} />
                </div>
                <span style={{ fontFamily: "monospace", fontSize: "0.85rem", color: "var(--text-muted)", minWidth: "2rem", textAlign: "right" }}>
                  {timeLeft}s
                </span>
              </div>
            </>
          )}
          {!code && !error && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem" }}>
              Enter a Base32 secret key to generate a TOTP code.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
