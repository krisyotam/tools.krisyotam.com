"use client"

import { useState, useMemo } from "react"
import { CopyButton } from "./CopyButton"

function escapeWifiString(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/;/g, "\\;").replace(/:/g, "\\:").replace(/,/g, "\\,")
}

export function WifiQrCodeGeneratorTool() {
  const [ssid, setSsid] = useState("")
  const [password, setPassword] = useState("")
  const [encryption, setEncryption] = useState("WPA")
  const [hidden, setHidden] = useState(false)
  const [size, setSize] = useState(300)
  const [generated, setGenerated] = useState(false)

  const wifiString = useMemo(() => {
    if (!ssid.trim()) return ""
    let s = `WIFI:T:${encryption};S:${escapeWifiString(ssid)};`
    if (encryption !== "nopass" && password) {
      s += `P:${escapeWifiString(password)};`
    }
    if (hidden) {
      s += "H:true;"
    }
    s += ";"
    return s
  }, [ssid, password, encryption, hidden])

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(wifiString)}`

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">WiFi Details</p>
          <div className="tool-field">
            <label>SSID (Network Name)</label>
            <input
              type="text"
              value={ssid}
              onChange={e => { setSsid(e.target.value); setGenerated(false) }}
              placeholder="MyNetwork"
            />
          </div>
          <div className="tool-field">
            <label>Password</label>
            <input
              type="text"
              value={password}
              onChange={e => { setPassword(e.target.value); setGenerated(false) }}
              placeholder="password123"
              disabled={encryption === "nopass"}
            />
          </div>
          <div className="tool-row">
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Encryption</label>
              <select value={encryption} onChange={e => { setEncryption(e.target.value); setGenerated(false) }}>
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">None</option>
              </select>
            </div>
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Size (px)</label>
              <input
                type="number"
                value={size}
                onChange={e => { setSize(Math.max(100, Math.min(1000, Number(e.target.value)))); setGenerated(false) }}
                min={100}
                max={1000}
              />
            </div>
          </div>
          <div className="tool-toggles">
            <label className="tool-toggle">
              <input type="checkbox" checked={hidden} onChange={e => { setHidden(e.target.checked); setGenerated(false) }} />
              <span>Hidden Network</span>
            </label>
          </div>
          <div className="tool-actions" style={{ marginTop: "0.75rem" }}>
            <button onClick={() => setGenerated(true)} disabled={!ssid.trim()}>Generate QR Code</button>
          </div>
          {wifiString && (
            <div style={{ marginTop: "0.75rem" }}>
              <div className="tool-output-row">
                <span className="tool-output-label">WiFi String</span>
                <span className="tool-output-value">{wifiString}</span>
                <CopyButton text={wifiString} />
              </div>
            </div>
          )}
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">QR Code</p>
          {generated && ssid.trim() ? (
            <>
              <div style={{
                textAlign: "center",
                padding: "1rem",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}>
                <img
                  src={qrUrl}
                  alt="WiFi QR Code"
                  style={{ maxWidth: "100%", imageRendering: "pixelated" }}
                />
              </div>
              <div className="tool-actions" style={{ marginTop: "0.5rem" }}>
                <a href={qrUrl} download={`wifi-qr-${size}x${size}.png`} target="_blank" rel="noopener noreferrer">
                  <button>Download PNG</button>
                </a>
              </div>
            </>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "1rem" }}>
              Enter WiFi details and click Generate to create a QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
