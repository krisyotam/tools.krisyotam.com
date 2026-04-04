"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function SlugifyStringTool() {
  const [input, setInput] = useState("")
  const slug = input ? slugify(input) : ""

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Input text</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="My Blog Post Title! (2024)"
          />
        </div>
      </div>

      {slug && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span className="tool-output-label">Slug</span>
            <span className="tool-output-value">{slug}</span>
            <CopyButton text={slug} />
          </div>
        </div>
      )}
    </div>
  )
}
