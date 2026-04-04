"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function decodeSafelink(url: string): string | null {
  try {
    const parsed = new URL(url.trim())
    // Outlook SafeLinks typically have the original URL in the 'url' parameter
    const encoded = parsed.searchParams.get("url")
    if (encoded) return encoded

    // Some variants use 'u' or 'originalUrl'
    const u = parsed.searchParams.get("u")
    if (u) return u

    const orig = parsed.searchParams.get("originalUrl")
    if (orig) return orig

    // Google redirect links use 'q'
    const q = parsed.searchParams.get("q")
    if (q) return q

    // Generic redirect: try 'redirect', 'target', 'dest', 'destination'
    for (const key of ["redirect", "target", "dest", "destination", "goto", "link", "to"]) {
      const val = parsed.searchParams.get(key)
      if (val) return val
    }

    return null
  } catch {
    return null
  }
}

export function SafelinkDecoderTool() {
  const [input, setInput] = useState("")

  const decoded = input.trim() ? decodeSafelink(input) : null

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>SafeLink or redirect URL</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="https://nam02.safelinks.protection.outlook.com/?url=https%3A%2F%2Fexample.com..."
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      {decoded && (
        <div className="tool-section">
          <p className="tool-section-title">Decoded URL</p>
          <div className="tool-output-row">
            <span className="tool-output-value" style={{ fontFamily: "monospace", fontSize: "0.82rem", wordBreak: "break-all" }}>
              {decoded}
            </span>
            <CopyButton text={decoded} />
          </div>
        </div>
      )}

      {input.trim() && !decoded && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Could not extract a URL from the input. Make sure it contains a url=, q=, redirect=, or similar parameter.
        </p>
      )}
    </div>
  )
}
