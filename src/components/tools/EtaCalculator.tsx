"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function parseTime(value: string, unit: string): number {
  const n = parseFloat(value)
  if (isNaN(n) || n < 0) return 0
  switch (unit) {
    case "seconds": return n
    case "minutes": return n * 60
    case "hours": return n * 3600
    case "days": return n * 86400
    default: return n
  }
}

function formatDuration(seconds: number): string {
  if (seconds < 0) return "N/A"
  if (seconds < 60) return `${seconds.toFixed(1)}s`
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60)
    const s = Math.round(seconds % 60)
    return `${m}m ${s}s`
  }
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600)
    const m = Math.round((seconds % 3600) / 60)
    return `${h}h ${m}m`
  }
  const d = Math.floor(seconds / 86400)
  const h = Math.round((seconds % 86400) / 3600)
  return `${d}d ${h}h`
}

function formatSize(bytes: number, unit: string): string {
  return `${bytes.toFixed(2)} ${unit}/s`
}

export function EtaCalculatorTool() {
  const [totalSize, setTotalSize] = useState("")
  const [completedSize, setCompletedSize] = useState("")
  const [sizeUnit, setSizeUnit] = useState("MB")
  const [elapsedValue, setElapsedValue] = useState("")
  const [elapsedUnit, setElapsedUnit] = useState("seconds")

  const total = parseFloat(totalSize) || 0
  const completed = parseFloat(completedSize) || 0
  const elapsedSec = parseTime(elapsedValue, elapsedUnit)

  const canCalculate = total > 0 && completed > 0 && elapsedSec > 0 && completed <= total

  let progress = 0
  let speed = 0
  let remaining = 0
  let eta = ""

  if (canCalculate) {
    progress = (completed / total) * 100
    speed = completed / elapsedSec
    const left = total - completed
    remaining = left / speed
    const etaDate = new Date(Date.now() + remaining * 1000)
    eta = etaDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const rows = canCalculate
    ? [
        { label: "Progress", value: `${progress.toFixed(2)}%` },
        { label: "Speed", value: formatSize(speed, sizeUnit) },
        { label: "Time remaining", value: formatDuration(remaining) },
        { label: "ETA", value: eta },
        { label: "Total elapsed", value: formatDuration(elapsedSec) },
      ]
    : []

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Total size</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              value={totalSize}
              onChange={e => setTotalSize(e.target.value)}
              placeholder="1000"
              style={{ flex: 1 }}
              min={0}
            />
            <select value={sizeUnit} onChange={e => setSizeUnit(e.target.value)} style={{ width: "80px" }}>
              <option value="B">B</option>
              <option value="KB">KB</option>
              <option value="MB">MB</option>
              <option value="GB">GB</option>
              <option value="TB">TB</option>
              <option value="items">items</option>
            </select>
          </div>
        </div>
        <div className="tool-field">
          <label>Completed</label>
          <input
            type="number"
            value={completedSize}
            onChange={e => setCompletedSize(e.target.value)}
            placeholder="350"
            min={0}
          />
        </div>
        <div className="tool-field">
          <label>Elapsed time</label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="number"
              value={elapsedValue}
              onChange={e => setElapsedValue(e.target.value)}
              placeholder="120"
              style={{ flex: 1 }}
              min={0}
            />
            <select value={elapsedUnit} onChange={e => setElapsedUnit(e.target.value)} style={{ width: "100px" }}>
              <option value="seconds">seconds</option>
              <option value="minutes">minutes</option>
              <option value="hours">hours</option>
              <option value="days">days</option>
            </select>
          </div>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Estimate</p>
          {rows.map(r => (
            <div className="tool-output-row" key={r.label}>
              <span className="tool-output-label">{r.label}</span>
              <span className="tool-output-value">{r.value}</span>
              <CopyButton text={r.value} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
