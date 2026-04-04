"use client"

import { useState } from "react"

type DiffLine = { type: "same" | "added" | "removed"; text: string }

function diffLines(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const m = linesA.length
  const n = linesB.length

  // Build LCS table
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = linesA[i - 1] === linesB[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1])
    }
  }

  // Backtrack
  const result: DiffLine[] = []
  let i = m, j = n
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      result.unshift({ type: "same", text: linesA[i - 1] })
      i--; j--
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", text: linesB[j - 1] })
      j--
    } else {
      result.unshift({ type: "removed", text: linesA[i - 1] })
      i--
    }
  }
  return result
}

const colors = {
  added: { bg: "hsla(120, 40%, 70%, 0.2)", prefix: "+" },
  removed: { bg: "hsla(0, 40%, 70%, 0.2)", prefix: "-" },
  same: { bg: "transparent", prefix: " " },
}

export function TextDiffTool() {
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")
  const [result, setResult] = useState<DiffLine[] | null>(null)

  const compare = () => {
    setResult(diffLines(textA, textB))
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Original</label>
          <textarea value={textA} onChange={e => setTextA(e.target.value)} rows={6} placeholder="Paste original text..." />
        </div>
        <div className="tool-field">
          <label>Modified</label>
          <textarea value={textB} onChange={e => setTextB(e.target.value)} rows={6} placeholder="Paste modified text..." />
        </div>
        <div className="tool-actions">
          <button onClick={compare}>Compare</button>
        </div>
      </div>

      {result && (
        <div className="tool-section">
          <p className="tool-section-title">Diff</p>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 500,
            margin: 0,
            fontFamily: "monospace",
          }}>
            {result.map((line, i) => (
              <div key={i} style={{ background: colors[line.type].bg, padding: "1px 4px" }}>
                <span style={{ color: "var(--text-muted)", userSelect: "none" }}>{colors[line.type].prefix} </span>
                {line.text}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
