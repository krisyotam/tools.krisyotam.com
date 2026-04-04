"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "./CopyButton"

interface ParsedUA {
  browser: string
  browserVersion: string
  engine: string
  engineVersion: string
  os: string
  osVersion: string
  raw: string
}

function parseUserAgent(ua: string): ParsedUA {
  const result: ParsedUA = {
    browser: "Unknown",
    browserVersion: "",
    engine: "Unknown",
    engineVersion: "",
    os: "Unknown",
    osVersion: "",
    raw: ua,
  }

  // OS detection
  if (/Windows NT (\d+[\d.]*)/i.test(ua)) {
    result.os = "Windows"
    const ver = ua.match(/Windows NT (\d+[\d.]*)/)
    const map: Record<string, string> = { "10.0": "10/11", "6.3": "8.1", "6.2": "8", "6.1": "7", "6.0": "Vista", "5.1": "XP" }
    result.osVersion = ver ? (map[ver[1]] || ver[1]) : ""
  } else if (/Mac OS X ([\d_.]+)/i.test(ua)) {
    result.os = "macOS"
    const ver = ua.match(/Mac OS X ([\d_.]+)/)
    result.osVersion = ver ? ver[1].replace(/_/g, ".") : ""
  } else if (/Android ([\d.]+)/i.test(ua)) {
    result.os = "Android"
    const ver = ua.match(/Android ([\d.]+)/)
    result.osVersion = ver ? ver[1] : ""
  } else if (/iPhone OS ([\d_]+)/i.test(ua)) {
    result.os = "iOS"
    const ver = ua.match(/iPhone OS ([\d_]+)/)
    result.osVersion = ver ? ver[1].replace(/_/g, ".") : ""
  } else if (/iPad/i.test(ua)) {
    result.os = "iPadOS"
    const ver = ua.match(/OS ([\d_]+)/)
    result.osVersion = ver ? ver[1].replace(/_/g, ".") : ""
  } else if (/Linux/i.test(ua)) {
    result.os = "Linux"
    if (/Ubuntu/i.test(ua)) result.os = "Ubuntu"
    if (/Fedora/i.test(ua)) result.os = "Fedora"
    if (/CrOS/i.test(ua)) result.os = "Chrome OS"
  }

  // Engine detection
  if (/AppleWebKit\/([\d.]+)/i.test(ua)) {
    result.engine = "WebKit"
    const ver = ua.match(/AppleWebKit\/([\d.]+)/)
    result.engineVersion = ver ? ver[1] : ""
    if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) {
      result.engine = "Blink"
    }
  } else if (/Gecko\/([\d.]+)/i.test(ua)) {
    result.engine = "Gecko"
    const ver = ua.match(/Gecko\/([\d.]+)/)
    result.engineVersion = ver ? ver[1] : ""
  } else if (/Trident\/([\d.]+)/i.test(ua)) {
    result.engine = "Trident"
    const ver = ua.match(/Trident\/([\d.]+)/)
    result.engineVersion = ver ? ver[1] : ""
  }

  // Browser detection (order matters - more specific first)
  if (/Edg\/([\d.]+)/i.test(ua)) {
    result.browser = "Microsoft Edge"
    const ver = ua.match(/Edg\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/OPR\/([\d.]+)/i.test(ua) || /Opera\/([\d.]+)/i.test(ua)) {
    result.browser = "Opera"
    const ver = ua.match(/OPR\/([\d.]+)/) || ua.match(/Opera\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/Vivaldi\/([\d.]+)/i.test(ua)) {
    result.browser = "Vivaldi"
    const ver = ua.match(/Vivaldi\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/Brave/i.test(ua)) {
    result.browser = "Brave"
    const ver = ua.match(/Chrome\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/Firefox\/([\d.]+)/i.test(ua)) {
    result.browser = "Firefox"
    const ver = ua.match(/Firefox\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/Chrome\/([\d.]+)/i.test(ua)) {
    result.browser = "Chrome"
    const ver = ua.match(/Chrome\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/Safari\/([\d.]+)/i.test(ua) && /Version\/([\d.]+)/i.test(ua)) {
    result.browser = "Safari"
    const ver = ua.match(/Version\/([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  } else if (/MSIE ([\d.]+)/i.test(ua) || /Trident/i.test(ua)) {
    result.browser = "Internet Explorer"
    const ver = ua.match(/MSIE ([\d.]+)/) || ua.match(/rv:([\d.]+)/)
    result.browserVersion = ver ? ver[1] : ""
  }

  return result
}

export function UserAgentParserTool() {
  const [ua, setUa] = useState("")
  const [parsed, setParsed] = useState<ParsedUA | null>(null)

  useEffect(() => {
    const raw = navigator.userAgent
    setUa(raw)
    setParsed(parseUserAgent(raw))
  }, [])

  const handleChange = (value: string) => {
    setUa(value)
    if (value.trim()) {
      setParsed(parseUserAgent(value))
    } else {
      setParsed(null)
    }
  }

  const rows = parsed
    ? [
        { label: "Browser", value: parsed.browser + (parsed.browserVersion ? ` ${parsed.browserVersion}` : "") },
        { label: "Engine", value: parsed.engine + (parsed.engineVersion ? ` ${parsed.engineVersion}` : "") },
        { label: "OS", value: parsed.os + (parsed.osVersion ? ` ${parsed.osVersion}` : "") },
        { label: "Raw", value: parsed.raw },
      ]
    : []

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>User agent string</label>
          <textarea
            value={ua}
            onChange={e => handleChange(e.target.value)}
            rows={3}
            placeholder="Paste a user agent string or use the auto-detected one..."
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      {parsed && (
        <div className="tool-section">
          <p className="tool-section-title">Parsed result</p>
          {rows.map(r => (
            <div className="tool-output-row" key={r.label}>
              <span className="tool-output-label">{r.label}</span>
              <span className="tool-output-value" style={{ fontSize: "0.82rem" }}>{r.value}</span>
              <CopyButton text={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
