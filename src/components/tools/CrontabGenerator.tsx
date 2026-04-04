"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const PRESETS: Record<string, string[]> = {
  "Every minute": ["*", "*", "*", "*", "*"],
  "Every hour": ["0", "*", "*", "*", "*"],
  "Every day at midnight": ["0", "0", "*", "*", "*"],
  "Every Sunday at midnight": ["0", "0", "*", "*", "0"],
  "Every weekday at 9am": ["0", "9", "*", "*", "1-5"],
  "Every 5 minutes": ["*/5", "*", "*", "*", "*"],
  "Every 15 minutes": ["*/15", "*", "*", "*", "*"],
  "First of every month": ["0", "0", "1", "*", "*"],
  "Every 6 hours": ["0", "*/6", "*", "*", "*"],
}

const MONTHS = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

function describe(min: string, hour: string, dom: string, mon: string, dow: string): string {
  const parts: string[] = []

  if (min === "*" && hour === "*" && dom === "*" && mon === "*" && dow === "*") {
    return "Every minute"
  }

  if (dow !== "*") {
    if (dow.includes("-")) {
      const [a, b] = dow.split("-").map(Number)
      parts.push(`on ${DAYS[a] || a} through ${DAYS[b] || b}`)
    } else if (dow.includes(",")) {
      const ds = dow.split(",").map(d => DAYS[Number(d)] || d)
      parts.push(`on ${ds.join(", ")}`)
    } else {
      parts.push(`on ${DAYS[Number(dow)] || dow}`)
    }
  }

  if (dom !== "*") {
    parts.push(`on day ${dom} of the month`)
  }

  if (mon !== "*") {
    if (mon.includes(",")) {
      const ms = mon.split(",").map(m => MONTHS[Number(m)] || m)
      parts.push(`in ${ms.join(", ")}`)
    } else {
      parts.push(`in ${MONTHS[Number(mon)] || mon}`)
    }
  }

  if (hour === "*" && min === "*") {
    parts.unshift("Every minute")
  } else if (hour === "*") {
    parts.unshift(`At minute ${min} of every hour`)
  } else if (min === "*") {
    parts.unshift(`Every minute during hour ${hour}`)
  } else if (hour.startsWith("*/")) {
    parts.unshift(`At minute ${min} every ${hour.slice(2)} hours`)
  } else if (min.startsWith("*/")) {
    parts.unshift(`Every ${min.slice(2)} minutes`)
    if (hour !== "*") parts.push(`during hour ${hour}`)
  } else {
    parts.unshift(`At ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`)
  }

  if (min.startsWith("*/") && hour === "*" && dom === "*" && mon === "*" && dow === "*") {
    return `Every ${min.slice(2)} minutes`
  }

  return parts.join(", ")
}

export function CrontabGeneratorTool() {
  const [min, setMin] = useState("*")
  const [hour, setHour] = useState("*")
  const [dom, setDom] = useState("*")
  const [mon, setMon] = useState("*")
  const [dow, setDow] = useState("*")
  const [preset, setPreset] = useState("")

  const applyPreset = (name: string) => {
    const p = PRESETS[name]
    if (p) {
      setMin(p[0]); setHour(p[1]); setDom(p[2]); setMon(p[3]); setDow(p[4])
    }
    setPreset(name)
  }

  const cron = `${min} ${hour} ${dom} ${mon} ${dow}`
  const description = describe(min, hour, dom, mon, dow)

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Preset</label>
          <select value={preset} onChange={e => applyPreset(e.target.value)}>
            <option value="">Custom</option>
            {Object.keys(PRESETS).map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="tool-field">
          <label>Minute (0-59)</label>
          <input type="text" value={min} onChange={e => { setMin(e.target.value); setPreset("") }} placeholder="*" />
        </div>
        <div className="tool-field">
          <label>Hour (0-23)</label>
          <input type="text" value={hour} onChange={e => { setHour(e.target.value); setPreset("") }} placeholder="*" />
        </div>
        <div className="tool-field">
          <label>Day of Month (1-31)</label>
          <input type="text" value={dom} onChange={e => { setDom(e.target.value); setPreset("") }} placeholder="*" />
        </div>
        <div className="tool-field">
          <label>Month (1-12)</label>
          <input type="text" value={mon} onChange={e => { setMon(e.target.value); setPreset("") }} placeholder="*" />
        </div>
        <div className="tool-field">
          <label>Day of Week (0-6, Sun=0)</label>
          <input type="text" value={dow} onChange={e => { setDow(e.target.value); setPreset("") }} placeholder="*" />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-output-row">
          <span className="tool-output-label">Expression</span>
          <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{cron}</span>
          <CopyButton text={cron} />
        </div>
        <div className="tool-output-row">
          <span className="tool-output-label">Description</span>
          <span className="tool-output-value">{description}</span>
        </div>
      </div>
    </div>
  )
}
