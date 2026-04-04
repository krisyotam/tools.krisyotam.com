"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface YamlNode {
  [key: string]: string | number | boolean | null | YamlNode | (string | number | boolean | null | YamlNode)[]
}

function parseSimpleYaml(yaml: string): YamlNode {
  const lines = yaml.split("\n")
  const root: YamlNode = {}
  const stack: { obj: YamlNode; indent: number }[] = [{ obj: root, indent: -1 }]
  let currentArray: { key: string; parent: YamlNode; items: unknown[] } | null = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim() || line.trim().startsWith("#")) continue

    const indent = line.search(/\S/)

    // Array item
    const arrayMatch = line.match(/^(\s*)- (.*)$/)
    if (arrayMatch) {
      const val = parseYamlValue(arrayMatch[2].trim())
      if (currentArray && indent >= stack[stack.length - 1].indent) {
        currentArray.items.push(val)
        continue
      }
    }

    if (currentArray) {
      currentArray.parent[currentArray.key] = currentArray.items as YamlNode[keyof YamlNode]
      currentArray = null
    }

    const match = line.match(/^(\s*)([^:\s][^:]*?)\s*:\s*(.*)$/)
    if (!match) continue

    const key = match[2].trim()
    const rawValue = match[3].trim()

    // Pop stack to find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop()
    }

    const parent = stack[stack.length - 1].obj

    if (rawValue === "" || rawValue === "|" || rawValue === ">") {
      // Check if next line is an array item
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ""
      const nextIndent = nextLine.search(/\S/)
      if (nextLine.trim().startsWith("- ") && nextIndent > indent) {
        currentArray = { key, parent, items: [] }
        continue
      }
      // Nested object
      const child: YamlNode = {}
      parent[key] = child
      stack.push({ obj: child, indent })
    } else {
      parent[key] = parseYamlValue(rawValue)
    }
  }

  if (currentArray) {
    currentArray.parent[currentArray.key] = currentArray.items as YamlNode[keyof YamlNode]
  }

  return root
}

function parseYamlValue(val: string): string | number | boolean | null {
  if (val === "null" || val === "~") return null
  if (val === "true") return true
  if (val === "false") return false
  if (/^-?\d+$/.test(val)) return parseInt(val, 10)
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val)
  // Strip quotes
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1)
  }
  return val
}

export function YamlToJsonTool() {
  const [yaml, setYaml] = useState("")
  const [error, setError] = useState("")

  let json = ""
  if (yaml.trim()) {
    try {
      const parsed = parseSimpleYaml(yaml)
      json = JSON.stringify(parsed, null, 2)
      if (error) setError("")
    } catch (e) {
      json = ""
    }
  }

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section">
          <div className="tool-field">
            <label>YAML</label>
            <textarea
              value={yaml}
              onChange={e => { setYaml(e.target.value); setError("") }}
              rows={14}
              placeholder={"name: John\nage: 30\naddress:\n  street: 123 Main St\n  city: Anytown"}
              style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
            />
          </div>
        </div>

        <div className="tool-section">
          <div className="tool-field">
            <label>JSON</label>
            <textarea
              value={json}
              readOnly
              rows={14}
              placeholder="JSON output will appear here..."
              style={{ fontFamily: "monospace", fontSize: "0.82rem", background: "var(--bg-secondary)" }}
            />
          </div>
          {json && (
            <div className="tool-actions">
              <CopyButton text={json} />
            </div>
          )}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        Supports a subset of YAML: key-value pairs, nested objects, simple arrays, quoted strings, numbers, booleans, and null. Complex YAML features (anchors, multi-line strings, flow sequences) are not supported.
      </p>
    </div>
  )
}
