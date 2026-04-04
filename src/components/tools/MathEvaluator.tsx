"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const ALLOWED = /^[\d+\-*/().,%\s^eE]+$/
const FUNCTIONS = ["sqrt", "sin", "cos", "tan", "abs", "pow", "log", "ceil", "floor", "round", "min", "max", "PI", "E"]

function evaluate(expr: string): string {
  let sanitized = expr.trim()
  // Replace function names with Math.*
  for (const fn of FUNCTIONS) {
    sanitized = sanitized.replace(new RegExp(`\\b${fn}\\b`, "g"), `Math.${fn}`)
  }
  // Replace ^ with **
  sanitized = sanitized.replace(/\^/g, "**")

  // Validate: only Math.*, numbers, operators, parens, whitespace
  const check = sanitized.replace(/Math\.\w+/g, "0")
  if (!ALLOWED.test(check)) throw new Error("Invalid characters in expression")

  const fn = new Function(`"use strict"; return (${sanitized})`)
  const result = fn()
  if (typeof result !== "number" || !isFinite(result)) throw new Error("Result is not a finite number")
  return String(result)
}

export function MathEvaluatorTool() {
  const [expr, setExpr] = useState("")
  const [result, setResult] = useState("")
  const [error, setError] = useState("")

  const calc = () => {
    setError("")
    try {
      setResult(evaluate(expr))
    } catch (e: any) {
      setError(e.message)
      setResult("")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Expression</label>
          <input type="text" value={expr} onChange={e => setExpr(e.target.value)} placeholder="sqrt(144) + 2^3 * sin(PI/4)" style={{ fontFamily: "monospace" }} onKeyDown={e => { if (e.key === "Enter") calc() }} />
        </div>
        <div className="tool-actions">
          <button onClick={calc}>Evaluate</button>
        </div>
        {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}
      </div>

      {result && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span className="tool-output-label">Result</span>
            <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{result}</span>
            <CopyButton text={result} />
          </div>
        </div>
      )}
    </div>
  )
}
