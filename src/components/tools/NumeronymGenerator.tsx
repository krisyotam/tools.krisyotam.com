"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function toNumeronym(word: string): string {
  if (word.length <= 3) return word
  return word[0] + String(word.length - 2) + word[word.length - 1]
}

export function NumeronymGeneratorTool() {
  const [input, setInput] = useState("")

  const words = input.split(/\s+/).filter(Boolean)
  const numeronyms = words.map(toNumeronym)
  const output = numeronyms.join(" ")

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Input Text</label>
          <textarea value={input} onChange={e => setInput(e.target.value)} rows={4} placeholder="internationalization localization accessibility" />
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Numeronyms</p>
            <CopyButton text={output} />
          </div>
          {words.map((word, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-label" style={{ fontFamily: "monospace" }}>{word}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{numeronyms[i]}</span>
              <CopyButton text={numeronyms[i]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
