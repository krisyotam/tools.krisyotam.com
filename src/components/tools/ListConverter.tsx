"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function ListConverterTool() {
  const [input, setInput] = useState("")
  const [sort, setSort] = useState(false)
  const [reverse, setReverse] = useState(false)
  const [deduplicate, setDeduplicate] = useState(false)
  const [trimLines, setTrimLines] = useState(false)
  const [lowercase, setLowercase] = useState(false)
  const [uppercase, setUppercase] = useState(false)
  const [removeEmpty, setRemoveEmpty] = useState(false)
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")

  function process(text: string): string {
    let lines = text.split("\n")

    if (trimLines) lines = lines.map(l => l.trim())
    if (removeEmpty) lines = lines.filter(l => l.trim() !== "")
    if (lowercase) lines = lines.map(l => l.toLowerCase())
    if (uppercase) lines = lines.map(l => l.toUpperCase())
    if (deduplicate) {
      const seen = new Set<string>()
      lines = lines.filter(l => {
        if (seen.has(l)) return false
        seen.add(l)
        return true
      })
    }
    if (sort) lines.sort((a, b) => a.localeCompare(b))
    if (reverse) lines.reverse()
    if (prefix || suffix) lines = lines.map(l => `${prefix}${l}${suffix}`)

    return lines.join("\n")
  }

  const output = input ? process(input) : ""

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Input list (one item per line)</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={8}
            placeholder={"banana\napple\ncherry\napple\n  grape  \n\norange"}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-toggles">
          <label className="tool-toggle">
            <input type="checkbox" checked={trimLines} onChange={e => setTrimLines(e.target.checked)} />
            Trim whitespace
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={removeEmpty} onChange={e => setRemoveEmpty(e.target.checked)} />
            Remove empty lines
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={deduplicate} onChange={e => setDeduplicate(e.target.checked)} />
            Deduplicate
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)} />
            Sort A-Z
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={reverse} onChange={e => setReverse(e.target.checked)} />
            Reverse
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={lowercase} onChange={e => setLowercase(e.target.checked)} />
            Lowercase
          </label>
          <label className="tool-toggle">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} />
            Uppercase
          </label>
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-row">
          <div className="tool-field">
            <label>Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
              placeholder='e.g. "  - "'
            />
          </div>
          <div className="tool-field">
            <label>Suffix</label>
            <input
              type="text"
              value={suffix}
              onChange={e => setSuffix(e.target.value)}
              placeholder='e.g. ","'
            />
          </div>
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-field">
          <label>Output</label>
          <textarea
            value={output}
            readOnly
            rows={8}
            placeholder="Processed output will appear here..."
            style={{ background: "var(--bg-secondary)" }}
          />
        </div>
        {output && (
          <div className="tool-actions">
            <CopyButton text={output} />
          </div>
        )}
      </div>
    </div>
  )
}
