"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/")
  while (base64.length % 4) base64 += "="
  return atob(base64)
}

interface JwtResult {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signature: string
}

function parseJwt(token: string): JwtResult | null {
  const parts = token.trim().split(".")
  if (parts.length !== 3) return null
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]))
    const payload = JSON.parse(base64UrlDecode(parts[1]))
    return { header, payload, signature: parts[2] }
  } catch {
    return null
  }
}

function getExpStatus(payload: Record<string, unknown>): string | null {
  if (typeof payload.exp !== "number") return null
  const expDate = new Date(payload.exp * 1000)
  const now = Date.now()
  if (expDate.getTime() < now) {
    return `Expired ${expDate.toISOString()}`
  }
  return `Valid until ${expDate.toISOString()}`
}

export function JwtParserTool() {
  const [input, setInput] = useState("")
  const parsed = input.trim() ? parseJwt(input) : null
  const invalid = input.trim().length > 0 && !parsed

  const headerJson = parsed ? JSON.stringify(parsed.header, null, 2) : ""
  const payloadJson = parsed ? JSON.stringify(parsed.payload, null, 2) : ""
  const expStatus = parsed ? getExpStatus(parsed.payload) : null
  const isExpired = expStatus?.startsWith("Expired") ?? false

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>JWT token</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder="Paste a JWT (eyJhbGciOi...)"
          />
        </div>
      </div>

      {invalid && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>
          Invalid JWT. Must be three base64url segments separated by dots.
        </p>
      )}

      {parsed && (
        <>
          {expStatus && (
            <div className="tool-section">
              <div className="tool-output-row">
                <span className="tool-output-label">Expiration</span>
                <span
                  className="tool-output-value"
                  style={{ color: isExpired ? "hsl(0 70% 55%)" : "hsl(140 50% 40%)" }}
                >
                  {expStatus}
                </span>
              </div>
            </div>
          )}

          <div className="tool-section">
            <p className="tool-section-title">Header</p>
            <div className="tool-output-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
              <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0, width: "100%" }}>
                {headerJson}
              </pre>
              <CopyButton text={headerJson} />
            </div>
          </div>

          <div className="tool-section">
            <p className="tool-section-title">Payload</p>
            <div className="tool-output-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
              <pre style={{ fontSize: "0.8rem", whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0, width: "100%" }}>
                {payloadJson}
              </pre>
              <CopyButton text={payloadJson} />
            </div>
          </div>

          <div className="tool-section">
            <div className="tool-output-row">
              <span className="tool-output-label">Signature</span>
              <span className="tool-output-value" style={{ wordBreak: "break-all" }}>{parsed.signature}</span>
              <CopyButton text={parsed.signature} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
