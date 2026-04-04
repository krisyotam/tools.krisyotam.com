"use client"

import { useState, useRef, useCallback } from "react"

function formatTime(ms: number): string {
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  const millis = Math.floor((ms % 1000) / 10)
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(millis).padStart(2, "0")}`
}

export function ChronometerTool() {
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [laps, setLaps] = useState<number[]>([])
  const startRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const accRef = useRef(0)

  const start = useCallback(() => {
    startRef.current = Date.now()
    intervalRef.current = setInterval(() => {
      setElapsed(accRef.current + (Date.now() - startRef.current))
    }, 10)
    setRunning(true)
  }, [])

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    accRef.current += Date.now() - startRef.current
    setElapsed(accRef.current)
    setRunning(false)
  }, [])

  const reset = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    accRef.current = 0
    setElapsed(0)
    setRunning(false)
    setLaps([])
  }, [])

  const lap = useCallback(() => {
    setLaps(prev => [...prev, elapsed])
  }, [elapsed])

  return (
    <div>
      <div className="tool-section">
        <div style={{
          fontSize: "2rem",
          fontFamily: "monospace",
          textAlign: "center",
          padding: "1.5rem 0",
          color: "var(--text-primary)",
        }}>
          {formatTime(elapsed)}
        </div>
        <div className="tool-actions" style={{ justifyContent: "center" }}>
          {!running ? (
            <button onClick={start}>{elapsed === 0 ? "Start" : "Resume"}</button>
          ) : (
            <button onClick={stop}>Stop</button>
          )}
          {running && <button onClick={lap}>Lap</button>}
          {!running && elapsed > 0 && <button onClick={reset}>Reset</button>}
        </div>
      </div>

      {laps.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Laps</p>
          {laps.map((l, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-label">Lap {i + 1}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace" }}>
                {formatTime(l)}{i > 0 ? ` (+${formatTime(l - laps[i - 1])})` : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
