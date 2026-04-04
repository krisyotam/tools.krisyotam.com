"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const ALGORITHMS = [
  { id: "SHA-1", label: "SHA1" },
  { id: "SHA-256", label: "SHA256" },
  { id: "SHA-384", label: "SHA384" },
  { id: "SHA-512", label: "SHA512" },
]

async function hashText(text: string, algo: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("")
}

export function HashTextTool() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<Record<string, string>>({})

  const handleInput = async (text: string) => {
    setInput(text)
    if (!text) { setResults({}); return }
    const hashes: Record<string, string> = {}
    for (const algo of ALGORITHMS) {
      hashes[algo.id] = await hashText(text, algo.id)
    }
    setResults(hashes)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Your text to hash</label>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder="Type or paste text..."
            rows={3}
          />
        </div>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Digest output</p>
          {ALGORITHMS.map(algo => (
            <div className="tool-output-row" key={algo.id}>
              <span className="tool-output-label">{algo.label}</span>
              <span className="tool-output-value">{results[algo.id]}</span>
              <CopyButton text={results[algo.id]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
