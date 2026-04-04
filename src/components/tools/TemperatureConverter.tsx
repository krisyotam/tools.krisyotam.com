"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

type Unit = "C" | "F" | "K" | "R"

function convert(val: number, from: Unit): Record<Unit, number> {
  let c: number
  switch (from) {
    case "C": c = val; break
    case "F": c = (val - 32) * 5 / 9; break
    case "K": c = val - 273.15; break
    case "R": c = (val - 491.67) * 5 / 9; break
  }
  return {
    C: c,
    F: c * 9 / 5 + 32,
    K: c + 273.15,
    R: (c + 273.15) * 9 / 5,
  }
}

const LABELS: Record<Unit, string> = { C: "Celsius", F: "Fahrenheit", K: "Kelvin", R: "Rankine" }
const SYMBOLS: Record<Unit, string> = { C: "\u00B0C", F: "\u00B0F", K: "K", R: "\u00B0R" }

export function TemperatureConverterTool() {
  const [value, setValue] = useState("100")
  const [unit, setUnit] = useState<Unit>("C")

  const num = parseFloat(value)
  const valid = !isNaN(num) && isFinite(num)
  const results = valid ? convert(num, unit) : null

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Temperature</label>
          <input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="100" />
        </div>
        <div className="tool-field">
          <label>Unit</label>
          <select value={unit} onChange={e => setUnit(e.target.value as Unit)}>
            {(Object.keys(LABELS) as Unit[]).map(u => (
              <option key={u} value={u}>{LABELS[u]} ({SYMBOLS[u]})</option>
            ))}
          </select>
        </div>
      </div>

      {results && (
        <div className="tool-section">
          {(Object.keys(results) as Unit[]).map(u => {
            const formatted = results[u].toFixed(4).replace(/\.?0+$/, "")
            return (
              <div className="tool-output-row" key={u}>
                <span className="tool-output-label">{LABELS[u]}</span>
                <span className="tool-output-value">{formatted} {SYMBOLS[u]}</span>
                <CopyButton text={`${formatted} ${SYMBOLS[u]}`} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
