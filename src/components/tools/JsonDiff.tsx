"use client"

import { useState } from "react"

interface DiffEntry {
  path: string
  type: "added" | "removed" | "changed"
  oldValue?: string
  newValue?: string
}

function diffObjects(a: unknown, b: unknown, path: string = ""): DiffEntry[] {
  const diffs: DiffEntry[] = []

  if (a === b) return diffs
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    if (a !== b) {
      diffs.push({ path: path || "(root)", type: "changed", oldValue: JSON.stringify(a), newValue: JSON.stringify(b) })
    }
    return diffs
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    const maxLen = Math.max(a.length, b.length)
    for (let i = 0; i < maxLen; i++) {
      const p = path ? `${path}[${i}]` : `[${i}]`
      if (i >= a.length) {
        diffs.push({ path: p, type: "added", newValue: JSON.stringify(b[i]) })
      } else if (i >= b.length) {
        diffs.push({ path: p, type: "removed", oldValue: JSON.stringify(a[i]) })
      } else {
        diffs.push(...diffObjects(a[i], b[i], p))
      }
    }
    return diffs
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    diffs.push({ path: path || "(root)", type: "changed", oldValue: JSON.stringify(a), newValue: JSON.stringify(b) })
    return diffs
  }

  const aObj = a as Record<string, unknown>
  const bObj = b as Record<string, unknown>
  const allKeys = new Set([...Object.keys(aObj), ...Object.keys(bObj)])

  for (const key of allKeys) {
    const p = path ? `${path}.${key}` : key
    if (!(key in aObj)) {
      diffs.push({ path: p, type: "added", newValue: JSON.stringify(bObj[key]) })
    } else if (!(key in bObj)) {
      diffs.push({ path: p, type: "removed", oldValue: JSON.stringify(aObj[key]) })
    } else {
      diffs.push(...diffObjects(aObj[key], bObj[key], p))
    }
  }

  return diffs
}

export function JsonDiffTool() {
  const [left, setLeft] = useState("")
  const [right, setRight] = useState("")
  const [diffs, setDiffs] = useState<DiffEntry[]>([])
  const [error, setError] = useState("")

  const compare = () => {
    setError("")
    setDiffs([])
    try {
      const a = JSON.parse(left)
      const b = JSON.parse(right)
      setDiffs(diffObjects(a, b))
    } catch (e: any) {
      setError(e.message)
    }
  }

  const colorMap = {
    added: "hsl(140 60% 40%)",
    removed: "hsl(0 70% 55%)",
    changed: "hsl(35 80% 50%)",
  }

  const labelMap = {
    added: "ADDED",
    removed: "REMOVED",
    changed: "CHANGED",
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Left JSON</label>
          <textarea
            value={left}
            onChange={e => setLeft(e.target.value)}
            rows={10}
            placeholder='{"name": "Alice", "age": 30}'
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Right JSON</label>
          <textarea
            value={right}
            onChange={e => setRight(e.target.value)}
            rows={10}
            placeholder='{"name": "Alice", "age": 31, "city": "NYC"}'
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="tool-actions">
        <button onClick={compare}>Compare</button>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      {diffs.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Differences ({diffs.length})</p>
          {diffs.map((d, i) => (
            <div
              className="tool-output-row"
              key={i}
              style={{ alignItems: "flex-start" }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: colorMap[d.type],
                  minWidth: "70px",
                  flexShrink: 0,
                }}
              >
                {labelMap[d.type]}
              </span>
              <span className="tool-output-label" style={{ fontFamily: "monospace", fontSize: "0.8rem", minWidth: "140px" }}>
                {d.path}
              </span>
              <span className="tool-output-value" style={{ fontFamily: "monospace", fontSize: "0.8rem" }}>
                {d.type === "changed" && `${d.oldValue} → ${d.newValue}`}
                {d.type === "added" && d.newValue}
                {d.type === "removed" && d.oldValue}
              </span>
            </div>
          ))}
        </div>
      )}

      {left.trim() && right.trim() && !error && diffs.length === 0 && left !== "" && right !== "" && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          Objects are identical.
        </p>
      )}
    </div>
  )
}
