"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function PercentageCalculatorTool() {
  const [x1, setX1] = useState("")
  const [y1, setY1] = useState("")
  const [x2, setX2] = useState("")
  const [y2, setY2] = useState("")
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const r1 = x1 && y1 ? String((parseFloat(x1) / 100) * parseFloat(y1)) : ""
  const r2 = x2 && y2 ? String((parseFloat(x2) / parseFloat(y2)) * 100) : ""
  const r3 = from && to ? String(((parseFloat(to) - parseFloat(from)) / parseFloat(from)) * 100) : ""

  return (
    <div>
      <div className="tool-section">
        <p className="tool-section-title">What is X% of Y?</p>
        <div className="tool-field">
          <label>X (%)</label>
          <input type="number" value={x1} onChange={e => setX1(e.target.value)} placeholder="25" />
        </div>
        <div className="tool-field">
          <label>Y</label>
          <input type="number" value={y1} onChange={e => setY1(e.target.value)} placeholder="200" />
        </div>
        {r1 && (
          <div className="tool-output-row">
            <span className="tool-output-label">Result</span>
            <span className="tool-output-value">{r1}</span>
            <CopyButton text={r1} />
          </div>
        )}
      </div>

      <div className="tool-section">
        <p className="tool-section-title">X is what % of Y?</p>
        <div className="tool-field">
          <label>X</label>
          <input type="number" value={x2} onChange={e => setX2(e.target.value)} placeholder="50" />
        </div>
        <div className="tool-field">
          <label>Y</label>
          <input type="number" value={y2} onChange={e => setY2(e.target.value)} placeholder="200" />
        </div>
        {r2 && (
          <div className="tool-output-row">
            <span className="tool-output-label">Result</span>
            <span className="tool-output-value">{r2}%</span>
            <CopyButton text={r2 + "%"} />
          </div>
        )}
      </div>

      <div className="tool-section">
        <p className="tool-section-title">Percentage change from X to Y</p>
        <div className="tool-field">
          <label>From</label>
          <input type="number" value={from} onChange={e => setFrom(e.target.value)} placeholder="100" />
        </div>
        <div className="tool-field">
          <label>To</label>
          <input type="number" value={to} onChange={e => setTo(e.target.value)} placeholder="150" />
        </div>
        {r3 && (
          <div className="tool-output-row">
            <span className="tool-output-label">Change</span>
            <span className="tool-output-value">{parseFloat(r3) >= 0 ? "+" : ""}{r3}%</span>
            <CopyButton text={r3 + "%"} />
          </div>
        )}
      </div>
    </div>
  )
}
