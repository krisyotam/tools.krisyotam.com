"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const WORDS = LOREM.replace(/[.,]/g, "").split(/\s+/)
const SENTENCES = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
  "Curabitur pretium tincidunt lacus, nec varius dolor aliquet sit amet.",
  "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames.",
  "Maecenas sed diam eget risus varius blandit sit amet non magna.",
  "Donec ullamcorper nulla non metus auctor fringilla.",
]

function genWords(n: number): string {
  const out: string[] = []
  for (let i = 0; i < n; i++) out.push(WORDS[i % WORDS.length])
  out[0] = out[0].charAt(0).toUpperCase() + out[0].slice(1)
  return out.join(" ") + "."
}

function genSentences(n: number): string {
  return Array.from({ length: n }, (_, i) => SENTENCES[i % SENTENCES.length]).join(" ")
}

function genParagraphs(n: number): string {
  return Array.from({ length: n }, () => genSentences(4 + Math.floor(Math.random() * 3))).join("\n\n")
}

type Unit = "paragraphs" | "sentences" | "words"

export function LoremIpsumTool() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<Unit>("paragraphs")
  const [output, setOutput] = useState(() => genParagraphs(3))

  const generate = () => {
    if (unit === "paragraphs") setOutput(genParagraphs(count))
    else if (unit === "sentences") setOutput(genSentences(count))
    else setOutput(genWords(count))
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-row">
          <div className="tool-field">
            <label>Count</label>
            <input type="number" value={count} onChange={e => setCount(Math.max(1, Number(e.target.value)))} min={1} max={100} />
          </div>
          <div className="tool-field">
            <label>Unit</label>
            <select value={unit} onChange={e => setUnit(e.target.value as Unit)}>
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
        </div>
        <div className="tool-actions">
          <button onClick={generate}>Generate</button>
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
            <CopyButton text={output} />
          </div>
          <div className="output" style={{ whiteSpace: "pre-wrap", wordBreak: "normal", maxHeight: 400, overflow: "auto" }}>
            {output}
          </div>
        </div>
      )}
    </div>
  )
}
