"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function toWords(str: string): string[] {
  return str.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_\-./\\]+/g, " ").trim().split(/\s+/).filter(Boolean)
}

const converters: [string, (s: string) => string][] = [
  ["camelCase", s => { const w = toWords(s); return w.map((x, i) => i === 0 ? x.toLowerCase() : x[0].toUpperCase() + x.slice(1).toLowerCase()).join("") }],
  ["PascalCase", s => toWords(s).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join("")],
  ["snake_case", s => toWords(s).map(x => x.toLowerCase()).join("_")],
  ["kebab-case", s => toWords(s).map(x => x.toLowerCase()).join("-")],
  ["CONSTANT_CASE", s => toWords(s).map(x => x.toUpperCase()).join("_")],
  ["dot.case", s => toWords(s).map(x => x.toLowerCase()).join(".")],
  ["path/case", s => toWords(s).map(x => x.toLowerCase()).join("/")],
  ["Title Case", s => toWords(s).map(x => x[0].toUpperCase() + x.slice(1).toLowerCase()).join(" ")],
  ["Sentence case", s => { const w = toWords(s); return w.map((x, i) => i === 0 ? x[0].toUpperCase() + x.slice(1).toLowerCase() : x.toLowerCase()).join(" ") }],
  ["lowercase", s => s.toLowerCase()],
  ["UPPERCASE", s => s.toUpperCase()],
]

export function CaseConverterTool() {
  const [input, setInput] = useState("")

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Input text</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="myVariableName, some-text, SomeClass..." />
        </div>
      </div>

      {input && (
        <div className="tool-section">
          <p className="tool-section-title">Conversions</p>
          {converters.map(([name, fn]) => {
            const val = fn(input)
            return (
              <div className="tool-output-row" key={name}>
                <span className="tool-output-label">{name}</span>
                <span className="tool-output-value">{val}</span>
                <CopyButton text={val} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
