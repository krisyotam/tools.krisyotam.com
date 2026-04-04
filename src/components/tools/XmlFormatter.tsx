"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function formatXml(xml: string, indentSize: number = 2): string {
  // Remove existing whitespace between tags
  let formatted = xml.replace(/>\s+</g, "><").trim()

  const indent = " ".repeat(indentSize)
  let depth = 0
  const lines: string[] = []

  // Split on tag boundaries
  const tokens = formatted.match(/(<[^>]+>)|([^<]+)/g)
  if (!tokens) return xml

  for (const token of tokens) {
    const trimmed = token.trim()
    if (!trimmed) continue

    if (trimmed.startsWith("<?")) {
      // Processing instruction
      lines.push(indent.repeat(depth) + trimmed)
    } else if (trimmed.startsWith("<!--")) {
      // Comment
      lines.push(indent.repeat(depth) + trimmed)
    } else if (trimmed.startsWith("</")) {
      // Closing tag
      depth = Math.max(0, depth - 1)
      lines.push(indent.repeat(depth) + trimmed)
    } else if (trimmed.startsWith("<") && trimmed.endsWith("/>")) {
      // Self-closing tag
      lines.push(indent.repeat(depth) + trimmed)
    } else if (trimmed.startsWith("<") && !trimmed.startsWith("</")) {
      // Opening tag
      lines.push(indent.repeat(depth) + trimmed)
      depth++
    } else {
      // Text content
      lines.push(indent.repeat(depth) + trimmed)
    }
  }

  // Post-process: merge text nodes with their parent tags when short
  const result: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const curr = lines[i].trim()
    const next = lines[i + 1]?.trim()
    const after = lines[i + 2]?.trim()

    // If pattern is: <tag>  text  </tag> on three consecutive lines, merge
    if (
      curr.startsWith("<") && !curr.startsWith("</") && !curr.endsWith("/>") &&
      next && !next.startsWith("<") &&
      after && after.startsWith("</") &&
      next.length < 60
    ) {
      const tagName = curr.match(/<(\w+)/)?.[1]
      const closingTag = after.match(/<\/(\w+)/)?.[1]
      if (tagName && tagName === closingTag) {
        const baseIndent = lines[i].match(/^(\s*)/)?.[1] || ""
        result.push(`${baseIndent}${curr}${next}${after}`)
        i += 2
        continue
      }
    }

    result.push(lines[i])
  }

  return result.join("\n")
}

export function XmlFormatterTool() {
  const [input, setInput] = useState("")
  const [indent, setIndent] = useState(2)
  const [output, setOutput] = useState("")

  const format = () => {
    if (!input.trim()) return
    setOutput(formatXml(input, indent))
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>XML input</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={10}
            placeholder={'<root><item id="1"><name>Example</name><value>42</value></item></root>'}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
        <div className="tool-row" style={{ alignItems: "center" }}>
          <div className="tool-field" style={{ maxWidth: 120, marginBottom: 0 }}>
            <label>Indent</label>
            <input type="number" value={indent} onChange={e => setIndent(Number(e.target.value))} min={1} max={8} />
          </div>
          <div className="tool-actions" style={{ marginTop: 0 }}>
            <button onClick={format}>Format</button>
          </div>
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>Formatted XML</p>
            <CopyButton text={output} />
          </div>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 400,
            margin: 0,
            fontFamily: "monospace",
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
