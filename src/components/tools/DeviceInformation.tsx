"use client"

import { useState, useEffect } from "react"
import { CopyButton } from "./CopyButton"

interface DeviceInfo {
  screenWidth: string
  screenHeight: string
  viewportWidth: string
  viewportHeight: string
  pixelRatio: string
  userAgent: string
  platform: string
  language: string
  languages: string
  online: string
  memory: string
  cores: string
  cookiesEnabled: string
  touchPoints: string
  colorDepth: string
}

export function DeviceInformationTool() {
  const [info, setInfo] = useState<DeviceInfo | null>(null)

  useEffect(() => {
    const nav = navigator as Record<string, unknown>
    setInfo({
      screenWidth: `${screen.width}px`,
      screenHeight: `${screen.height}px`,
      viewportWidth: `${window.innerWidth}px`,
      viewportHeight: `${window.innerHeight}px`,
      pixelRatio: String(window.devicePixelRatio),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      languages: navigator.languages.join(", "),
      online: navigator.onLine ? "Yes" : "No",
      memory: typeof nav.deviceMemory === "number" ? `${nav.deviceMemory} GB` : "Not available",
      cores: typeof navigator.hardwareConcurrency === "number" ? String(navigator.hardwareConcurrency) : "Not available",
      cookiesEnabled: navigator.cookieEnabled ? "Yes" : "No",
      touchPoints: String(navigator.maxTouchPoints),
      colorDepth: `${screen.colorDepth}-bit`,
    })
  }, [])

  if (!info) return <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Loading device information...</p>

  const rows: { label: string; value: string }[] = [
    { label: "Screen width", value: info.screenWidth },
    { label: "Screen height", value: info.screenHeight },
    { label: "Viewport width", value: info.viewportWidth },
    { label: "Viewport height", value: info.viewportHeight },
    { label: "Pixel ratio", value: info.pixelRatio },
    { label: "Color depth", value: info.colorDepth },
    { label: "Touch points", value: info.touchPoints },
    { label: "User agent", value: info.userAgent },
    { label: "Platform", value: info.platform },
    { label: "Language", value: info.language },
    { label: "All languages", value: info.languages },
    { label: "Online", value: info.online },
    { label: "Device memory", value: info.memory },
    { label: "Logical cores", value: info.cores },
    { label: "Cookies enabled", value: info.cookiesEnabled },
  ]

  return (
    <div>
      <div className="tool-section">
        {rows.map(r => (
          <div className="tool-output-row" key={r.label}>
            <span className="tool-output-label">{r.label}</span>
            <span className="tool-output-value">{r.value}</span>
            <CopyButton text={r.value} />
          </div>
        ))}
      </div>
    </div>
  )
}
