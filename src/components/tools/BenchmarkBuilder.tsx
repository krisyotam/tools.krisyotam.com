"use client"

import { useState } from "react"

export function BenchmarkBuilderTool() {
  const [snippetA, setSnippetA] = useState("")
  const [snippetB, setSnippetB] = useState("")
  const [iterations, setIterations] = useState("10000")
  const [results, setResults] = useState<{ timeA: number; timeB: number; winner: string; factor: string } | null>(null)
  const [error, setError] = useState("")
  const [running, setRunning] = useState(false)

  const run = () => {
    setError("")
    setResults(null)
    setRunning(true)

    const n = parseInt(iterations) || 10000

    // Use setTimeout to let the UI update before blocking
    setTimeout(() => {
      try {
        // eslint-disable-next-line no-new-func
        const fnA = new Function(snippetA)
        // eslint-disable-next-line no-new-func
        const fnB = new Function(snippetB)

        // Warmup
        for (let i = 0; i < Math.min(100, n); i++) { fnA(); fnB() }

        const startA = performance.now()
        for (let i = 0; i < n; i++) fnA()
        const endA = performance.now()

        const startB = performance.now()
        for (let i = 0; i < n; i++) fnB()
        const endB = performance.now()

        const timeA = endA - startA
        const timeB = endB - startB

        let winner: string
        let factor: string
        if (timeA < timeB) {
          winner = "Snippet A"
          factor = `${(timeB / timeA).toFixed(2)}x faster`
        } else if (timeB < timeA) {
          winner = "Snippet B"
          factor = `${(timeA / timeB).toFixed(2)}x faster`
        } else {
          winner = "Tie"
          factor = "identical"
        }

        setResults({ timeA, timeB, winner, factor })
      } catch (e: any) {
        setError(e.message)
      }
      setRunning(false)
    }, 10)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Snippet A</label>
          <textarea
            value={snippetA}
            onChange={e => setSnippetA(e.target.value)}
            rows={6}
            placeholder={'let sum = 0;\nfor (let i = 0; i < 1000; i++) sum += i;'}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Snippet B</label>
          <textarea
            value={snippetB}
            onChange={e => setSnippetB(e.target.value)}
            rows={6}
            placeholder={'const arr = Array.from({length: 1000}, (_, i) => i);\nconst sum = arr.reduce((a, b) => a + b, 0);'}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-row" style={{ alignItems: "center" }}>
          <div className="tool-field" style={{ maxWidth: 160, marginBottom: 0 }}>
            <label>Iterations</label>
            <input
              type="number"
              value={iterations}
              onChange={e => setIterations(e.target.value)}
              min={1}
              max={10000000}
            />
          </div>
          <div className="tool-actions" style={{ marginTop: 0 }}>
            <button onClick={run} disabled={running || !snippetA.trim() || !snippetB.trim()}>
              {running ? "Running..." : "Run benchmark"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      {results && (
        <div className="tool-section">
          <p className="tool-section-title">Results</p>
          <div className="tool-output-row">
            <span className="tool-output-label">Snippet A</span>
            <span className="tool-output-value">{results.timeA.toFixed(3)} ms</span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Snippet B</span>
            <span className="tool-output-value">{results.timeB.toFixed(3)} ms</span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Winner</span>
            <span className="tool-output-value" style={{ fontWeight: 600 }}>
              {results.winner} ({results.factor})
            </span>
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Iterations</span>
            <span className="tool-output-value">{parseInt(iterations).toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
