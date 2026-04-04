"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const NATO: Record<string, string> = {
  A: "Alfa", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo",
  F: "Foxtrot", G: "Golf", H: "Hotel", I: "India", J: "Juliet",
  K: "Kilo", L: "Lima", M: "Mike", N: "November", O: "Oscar",
  P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
  U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee",
  Z: "Zulu",
  "0": "Zero", "1": "One", "2": "Two", "3": "Three", "4": "Four",
  "5": "Five", "6": "Six", "7": "Seven", "8": "Eight", "9": "Niner",
}

function textToNato(text: string): { char: string; word: string }[] {
  return Array.from(text).map(ch => {
    const upper = ch.toUpperCase()
    if (NATO[upper]) return { char: ch, word: NATO[upper] }
    if (ch === " ") return { char: "(space)", word: "" }
    return { char: ch, word: ch }
  })
}

export function TextToNatoTool() {
  const [input, setInput] = useState("")

  const result = input ? textToNato(input) : []
  const natoString = result
    .map(r => r.word || "(space)")
    .join(" ")

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Text</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type text to convert..."
          />
        </div>
      </div>

      {result.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">NATO Phonetic</p>
          {result.map((r, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-label" style={{ fontFamily: "monospace", minWidth: "2.5rem" }}>
                {r.char}
              </span>
              <span className="tool-output-value">
                {r.word || "\u2014"}
              </span>
            </div>
          ))}
        </div>
      )}

      {natoString && (
        <div className="tool-section">
          <div className="tool-field">
            <label>Full output</label>
            <textarea
              value={natoString}
              readOnly
              rows={3}
              style={{ background: "var(--bg-secondary)", fontFamily: "monospace" }}
            />
          </div>
          <div className="tool-actions">
            <CopyButton text={natoString} />
          </div>
        </div>
      )}
    </div>
  )
}
