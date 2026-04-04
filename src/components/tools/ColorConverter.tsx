"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.replace("#", "")
  const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h
  const m = full.match(/^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360; s /= 100; l /= 100
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v] }
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q - p) * 6 * t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
    return p
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ]
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("")
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1200) }
  return (
    <button onClick={copy} className="craft-copy-btn" title="Copy">
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  )
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="craft-value-row">
      <span className="craft-value-label">{label}</span>
      <span className="craft-value-text">{value}</span>
      <CopyBtn text={value} />
    </div>
  )
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#6b7280")
  const [rVal, setR] = useState(107)
  const [gVal, setG] = useState(114)
  const [bVal, setB] = useState(128)
  const [hVal, setH] = useState(220)
  const [sVal, setS] = useState(9)
  const [lVal, setL] = useState(46)

  const syncFromHex = (v: string) => {
    setHex(v)
    const rgb = hexToRgb(v)
    if (rgb) {
      setR(rgb[0]); setG(rgb[1]); setB(rgb[2])
      const hsl = rgbToHsl(...rgb)
      setH(hsl[0]); setS(hsl[1]); setL(hsl[2])
    }
  }

  const syncFromRgb = (r: number, g: number, b: number) => {
    setR(r); setG(g); setB(b)
    setHex(rgbToHex(r, g, b))
    const hsl = rgbToHsl(r, g, b)
    setH(hsl[0]); setS(hsl[1]); setL(hsl[2])
  }

  const syncFromHsl = (h: number, s: number, l: number) => {
    setH(h); setS(s); setL(l)
    const rgb = hslToRgb(h, s, l)
    setR(rgb[0]); setG(rgb[1]); setB(rgb[2])
    setHex(rgbToHex(...rgb))
  }

  const rgb = hexToRgb(hex)
  const validHex = rgb ? hex : "#000000"
  const hexStr = hex.startsWith("#") ? hex : `#${hex}`
  const rgbStr = `rgb(${rVal}, ${gVal}, ${bVal})`
  const hslStr = `hsl(${hVal}, ${sVal}%, ${lVal}%)`

  return (
    <div className="craft-block">
      {/* Top: color preview + picker */}
      <div className="craft-row" style={{ gap: "1.5rem", alignItems: "stretch" }}>
        {/* Large swatch */}
        <div
          className="craft-swatch"
          style={{ background: validHex }}
        />

        {/* Input columns */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* HEX input */}
          <div className="craft-input-group">
            <label className="craft-label">HEX</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                value={hex}
                onChange={e => syncFromHex(e.target.value)}
                className="craft-input"
                style={{ flex: 1 }}
              />
              <input
                type="color"
                value={validHex}
                onChange={e => syncFromHex(e.target.value)}
                className="craft-color-picker"
              />
            </div>
          </div>

          {/* RGB sliders */}
          <div className="craft-input-group">
            <label className="craft-label">RGB</label>
            <div className="craft-slider-row">
              <div className="craft-slider-col">
                <span className="craft-slider-label">R</span>
                <input type="range" min={0} max={255} value={rVal} onChange={e => syncFromRgb(+e.target.value, gVal, bVal)} className="craft-range" style={{ accentColor: "hsl(0 70% 60%)" }} />
                <input type="number" min={0} max={255} value={rVal} onChange={e => syncFromRgb(Math.min(255, Math.max(0, +e.target.value)), gVal, bVal)} className="craft-num" />
              </div>
              <div className="craft-slider-col">
                <span className="craft-slider-label">G</span>
                <input type="range" min={0} max={255} value={gVal} onChange={e => syncFromRgb(rVal, +e.target.value, bVal)} className="craft-range" style={{ accentColor: "hsl(120 50% 45%)" }} />
                <input type="number" min={0} max={255} value={gVal} onChange={e => syncFromRgb(rVal, Math.min(255, Math.max(0, +e.target.value)), bVal)} className="craft-num" />
              </div>
              <div className="craft-slider-col">
                <span className="craft-slider-label">B</span>
                <input type="range" min={0} max={255} value={bVal} onChange={e => syncFromRgb(rVal, gVal, +e.target.value)} className="craft-range" style={{ accentColor: "hsl(220 70% 55%)" }} />
                <input type="number" min={0} max={255} value={bVal} onChange={e => syncFromRgb(rVal, gVal, Math.min(255, Math.max(0, +e.target.value)))} className="craft-num" />
              </div>
            </div>
          </div>

          {/* HSL sliders */}
          <div className="craft-input-group">
            <label className="craft-label">HSL</label>
            <div className="craft-slider-row">
              <div className="craft-slider-col">
                <span className="craft-slider-label">H</span>
                <input type="range" min={0} max={360} value={hVal} onChange={e => syncFromHsl(+e.target.value, sVal, lVal)} className="craft-range" />
                <input type="number" min={0} max={360} value={hVal} onChange={e => syncFromHsl(Math.min(360, Math.max(0, +e.target.value)), sVal, lVal)} className="craft-num" />
              </div>
              <div className="craft-slider-col">
                <span className="craft-slider-label">S</span>
                <input type="range" min={0} max={100} value={sVal} onChange={e => syncFromHsl(hVal, +e.target.value, lVal)} className="craft-range" />
                <input type="number" min={0} max={100} value={sVal} onChange={e => syncFromHsl(hVal, Math.min(100, Math.max(0, +e.target.value)), lVal)} className="craft-num" />
              </div>
              <div className="craft-slider-col">
                <span className="craft-slider-label">L</span>
                <input type="range" min={0} max={100} value={lVal} onChange={e => syncFromHsl(hVal, sVal, +e.target.value)} className="craft-range" />
                <input type="number" min={0} max={100} value={lVal} onChange={e => syncFromHsl(hVal, sVal, Math.min(100, Math.max(0, +e.target.value)))} className="craft-num" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: output values */}
      <div className="craft-output-strip">
        <ValueRow label="HEX" value={hexStr} />
        <ValueRow label="RGB" value={rgbStr} />
        <ValueRow label="HSL" value={hslStr} />
      </div>
    </div>
  )
}
