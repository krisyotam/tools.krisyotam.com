"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

// Simple 5-line block font for uppercase letters, digits, and a few symbols
const FONT: Record<string, string[]> = {
  A: ["  #  ", " # # ", "#####", "#   #", "#   #"],
  B: ["#### ", "#   #", "#### ", "#   #", "#### "],
  C: [" ####", "#    ", "#    ", "#    ", " ####"],
  D: ["#### ", "#   #", "#   #", "#   #", "#### "],
  E: ["#####", "#    ", "###  ", "#    ", "#####"],
  F: ["#####", "#    ", "###  ", "#    ", "#    "],
  G: [" ####", "#    ", "# ###", "#   #", " ### "],
  H: ["#   #", "#   #", "#####", "#   #", "#   #"],
  I: ["#####", "  #  ", "  #  ", "  #  ", "#####"],
  J: ["#####", "   # ", "   # ", "#  # ", " ##  "],
  K: ["#   #", "#  # ", "###  ", "#  # ", "#   #"],
  L: ["#    ", "#    ", "#    ", "#    ", "#####"],
  M: ["#   #", "## ##", "# # #", "#   #", "#   #"],
  N: ["#   #", "##  #", "# # #", "#  ##", "#   #"],
  O: [" ### ", "#   #", "#   #", "#   #", " ### "],
  P: ["#### ", "#   #", "#### ", "#    ", "#    "],
  Q: [" ### ", "#   #", "# # #", "#  # ", " ## #"],
  R: ["#### ", "#   #", "#### ", "#  # ", "#   #"],
  S: [" ####", "#    ", " ### ", "    #", "#### "],
  T: ["#####", "  #  ", "  #  ", "  #  ", "  #  "],
  U: ["#   #", "#   #", "#   #", "#   #", " ### "],
  V: ["#   #", "#   #", "#   #", " # # ", "  #  "],
  W: ["#   #", "#   #", "# # #", "## ##", "#   #"],
  X: ["#   #", " # # ", "  #  ", " # # ", "#   #"],
  Y: ["#   #", " # # ", "  #  ", "  #  ", "  #  "],
  Z: ["#####", "   # ", "  #  ", " #   ", "#####"],
  "0": [" ### ", "#  ##", "# # #", "##  #", " ### "],
  "1": ["  #  ", " ##  ", "  #  ", "  #  ", "#####"],
  "2": [" ### ", "#   #", "  ## ", " #   ", "#####"],
  "3": [" ### ", "#   #", "  ## ", "#   #", " ### "],
  "4": ["#   #", "#   #", "#####", "    #", "    #"],
  "5": ["#####", "#    ", "#### ", "    #", "#### "],
  "6": [" ### ", "#    ", "#### ", "#   #", " ### "],
  "7": ["#####", "   # ", "  #  ", " #   ", "#    "],
  "8": [" ### ", "#   #", " ### ", "#   #", " ### "],
  "9": [" ### ", "#   #", " ####", "    #", " ### "],
  " ": ["     ", "     ", "     ", "     ", "     "],
  "!": ["  #  ", "  #  ", "  #  ", "     ", "  #  "],
  ".": ["     ", "     ", "     ", "     ", "  #  "],
  "?": [" ### ", "#   #", "  ## ", "     ", "  #  "],
  "-": ["     ", "     ", "#####", "     ", "     "],
}

function textToAscii(text: string): string {
  const upper = text.toUpperCase()
  const lines: string[] = ["", "", "", "", ""]

  for (let i = 0; i < upper.length; i++) {
    const ch = upper[i]
    const glyph = FONT[ch]
    if (glyph) {
      for (let row = 0; row < 5; row++) {
        lines[row] += glyph[row] + " "
      }
    } else {
      // Unknown character: render as blank
      for (let row = 0; row < 5; row++) {
        lines[row] += "     " + " "
      }
    }
  }

  return lines.map(l => l.trimEnd()).join("\n")
}

export function AsciiTextDrawerTool() {
  const [input, setInput] = useState("")

  const output = input.trim() ? textToAscii(input) : ""

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Text</label>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="HELLO WORLD"
          />
        </div>
      </div>

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>ASCII art</p>
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
            lineHeight: 1.2,
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
