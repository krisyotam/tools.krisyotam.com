"use client"

import { useState, useMemo } from "react"

export function RegexTesterTool() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState({ g: true, i: false, m: false })
  const [testStr, setTestStr] = useState("")

  const flagStr = (flags.g ? "g" : "") + (flags.i ? "i" : "") + (flags.m ? "m" : "")

  const result = useMemo(() => {
    if (!pattern) return null
    try {
      const re = new RegExp(pattern, flagStr)
      const matches: { match: string; index: number; groups: string[] }[] = []
      if (flags.g) {
        let m: RegExpExecArray | null
        while ((m = re.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
          if (m[0].length === 0) re.lastIndex++
        }
      } else {
        const m = re.exec(testStr)
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
      }
      return { matches, error: null }
    } catch (e: any) {
      return { matches: [], error: e.message }
    }
  }, [pattern, flagStr, testStr, flags.g])

  const highlighted = useMemo(() => {
    if (!result || result.error || result.matches.length === 0 || !pattern) return null
    try {
      const re = new RegExp(pattern, flagStr)
      const parts: { text: string; isMatch: boolean }[] = []
      let lastIndex = 0
      let m: RegExpExecArray | null
      const reClone = new RegExp(pattern, flags.g ? flagStr : flagStr + "g")
      while ((m = reClone.exec(testStr)) !== null) {
        if (m.index > lastIndex) parts.push({ text: testStr.slice(lastIndex, m.index), isMatch: false })
        parts.push({ text: m[0], isMatch: true })
        lastIndex = m.index + m[0].length
        if (m[0].length === 0) { reClone.lastIndex++; lastIndex++ }
        if (!flags.g) break
      }
      if (lastIndex < testStr.length) parts.push({ text: testStr.slice(lastIndex), isMatch: false })
      return parts
    } catch {
      return null
    }
  }, [pattern, flagStr, testStr, result, flags.g])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Pattern</label>
          <input type="text" value={pattern} onChange={e => setPattern(e.target.value)} placeholder="e.g. \d+|[a-z]+" style={{ fontFamily: "monospace" }} />
        </div>
        <div className="tool-toggles">
          {(["g", "i", "m"] as const).map(f => (
            <label key={f} className="tool-toggle">
              <input type="checkbox" checked={flags[f]} onChange={() => setFlags(s => ({ ...s, [f]: !s[f] }))} />
              {f}
            </label>
          ))}
        </div>
        <div className="tool-field">
          <label>Test String</label>
          <textarea value={testStr} onChange={e => setTestStr(e.target.value)} rows={5} placeholder="Enter text to test against..." />
        </div>
      </div>

      {result?.error && (
        <div className="tool-section">
          <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)" }}>{result.error}</p>
        </div>
      )}

      {highlighted && highlighted.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Highlighted Matches</p>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 300,
            margin: 0,
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
          }}>
            {highlighted.map((part, i) =>
              part.isMatch ? (
                <mark key={i} style={{ background: "hsl(50 80% 70%)", color: "hsl(0 0% 10%)", borderRadius: 0, padding: "0 1px" }}>{part.text}</mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </pre>
        </div>
      )}

      {result && !result.error && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span className="tool-output-label">Matches</span>
            <span className="tool-output-value">{result.matches.length}</span>
          </div>
          {result.matches.map((m, i) => (
            <div key={i} style={{ marginTop: "0.5rem" }}>
              <div className="tool-output-row">
                <span className="tool-output-label">Match {i + 1}</span>
                <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{`"${m.match}" at index ${m.index}`}</span>
              </div>
              {m.groups.length > 0 && m.groups.map((g, gi) => (
                <div className="tool-output-row" key={gi}>
                  <span className="tool-output-label" style={{ paddingLeft: "1rem" }}>Group {gi + 1}</span>
                  <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{g ?? "undefined"}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
