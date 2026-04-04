"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface ParsedUrl {
  protocol: string
  hostname: string
  port: string
  pathname: string
  search: string
  hash: string
  origin: string
  searchParams: [string, string][]
}

function parseUrl(raw: string): ParsedUrl | null {
  try {
    const u = new URL(raw)
    return {
      protocol: u.protocol,
      hostname: u.hostname,
      port: u.port,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      origin: u.origin,
      searchParams: Array.from(u.searchParams.entries()),
    }
  } catch {
    return null
  }
}

export function UrlParserTool() {
  const [input, setInput] = useState("")
  const parsed = input ? parseUrl(input) : null
  const invalid = input.length > 0 && !parsed

  const rows: { label: string; value: string }[] = parsed
    ? [
        { label: "Protocol", value: parsed.protocol },
        { label: "Hostname", value: parsed.hostname },
        { label: "Port", value: parsed.port || "(default)" },
        { label: "Pathname", value: parsed.pathname },
        { label: "Search", value: parsed.search || "(none)" },
        { label: "Hash", value: parsed.hash || "(none)" },
        { label: "Origin", value: parsed.origin },
      ]
    : []

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>URL</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="https://example.com:8080/path?q=1&r=2#section"
          />
        </div>
      </div>

      {invalid && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>
          Invalid URL. Include the protocol (e.g. https://).
        </p>
      )}

      {parsed && (
        <div className="tool-section">
          <p className="tool-section-title">Parsed components</p>
          {rows.map(r => (
            <div className="tool-output-row" key={r.label}>
              <span className="tool-output-label">{r.label}</span>
              <span className="tool-output-value">{r.value}</span>
              <CopyButton text={r.value} />
            </div>
          ))}
        </div>
      )}

      {parsed && parsed.searchParams.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Search parameters</p>
          {parsed.searchParams.map(([k, v], i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-label">{k}</span>
              <span className="tool-output-value">{v}</span>
              <CopyButton text={v} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
