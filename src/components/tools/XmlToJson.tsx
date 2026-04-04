"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function xmlNodeToJson(node: Element): unknown {
  const result: Record<string, unknown> = {}

  // Attributes
  if (node.attributes.length > 0) {
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      result[`@${attr.name}`] = attr.value
    }
  }

  // Child elements
  const childElements: Element[] = []
  const textParts: string[] = []

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i]
    if (child.nodeType === Node.ELEMENT_NODE) {
      childElements.push(child as Element)
    } else if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
      const text = (child.textContent || "").trim()
      if (text) textParts.push(text)
    }
  }

  if (childElements.length === 0) {
    // Leaf node
    const text = textParts.join("")
    if (node.attributes.length === 0) {
      return text || null
    }
    if (text) {
      result["#text"] = text
    }
    return result
  }

  // Group children by tag name
  const groups: Record<string, unknown[]> = {}
  for (const child of childElements) {
    const tag = child.tagName
    if (!groups[tag]) groups[tag] = []
    groups[tag].push(xmlNodeToJson(child))
  }

  for (const [tag, values] of Object.entries(groups)) {
    result[tag] = values.length === 1 ? values[0] : values
  }

  if (textParts.length > 0 && childElements.length > 0) {
    result["#text"] = textParts.join(" ")
  }

  return result
}

function convertXmlToJson(xml: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, "application/xml")

  const errorNode = doc.querySelector("parsererror")
  if (errorNode) {
    throw new Error(errorNode.textContent || "Invalid XML")
  }

  const root = doc.documentElement
  const json: Record<string, unknown> = {}
  json[root.tagName] = xmlNodeToJson(root)

  return JSON.stringify(json, null, 2)
}

export function XmlToJsonTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    if (!input.trim()) {
      setOutput("")
      setError("")
      return
    }
    try {
      const json = convertXmlToJson(input)
      setOutput(json)
      setError("")
    } catch (e) {
      setError((e as Error).message)
      setOutput("")
    }
  }

  return (
    <div>
      <div className="tool-actions" style={{ marginBottom: "0.75rem" }}>
        <button onClick={convert}>Convert to JSON</button>
      </div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">XML Input</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={18}
            placeholder={'<root>\n  <name>John</name>\n  <items>\n    <item>1</item>\n    <item>2</item>\n  </items>\n</root>'}
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">JSON Output</p>
            {output && <CopyButton text={output} />}
          </div>
          {error && <p style={{ color: "hsl(0 70% 55%)", fontSize: "0.8rem" }}>{error}</p>}
          <textarea
            value={output}
            readOnly
            rows={18}
            placeholder="JSON output will appear here..."
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </div>
      </div>
    </div>
  )
}
