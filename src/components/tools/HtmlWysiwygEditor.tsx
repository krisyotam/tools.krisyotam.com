"use client"

import { useState, useRef, useCallback } from "react"
import { CopyButton } from "./CopyButton"

const TOOLBAR_BUTTONS = [
  { cmd: "bold", label: "B", style: { fontWeight: 700 } },
  { cmd: "italic", label: "I", style: { fontStyle: "italic" } },
  { cmd: "underline", label: "U", style: { textDecoration: "underline" } },
  { cmd: "strikeThrough", label: "S", style: { textDecoration: "line-through" } },
  { cmd: "separator" },
  { cmd: "formatBlock", arg: "h1", label: "H1" },
  { cmd: "formatBlock", arg: "h2", label: "H2" },
  { cmd: "formatBlock", arg: "h3", label: "H3" },
  { cmd: "formatBlock", arg: "p", label: "P" },
  { cmd: "separator" },
  { cmd: "insertUnorderedList", label: "UL" },
  { cmd: "insertOrderedList", label: "OL" },
  { cmd: "separator" },
  { cmd: "formatBlock", arg: "blockquote", label: "Quote" },
  { cmd: "formatBlock", arg: "pre", label: "Code" },
  { cmd: "separator" },
  { cmd: "createLink", label: "Link", needsArg: true },
  { cmd: "unlink", label: "Unlink" },
] as const

export function HtmlWysiwygEditorTool() {
  const [htmlOutput, setHtmlOutput] = useState("")
  const editorRef = useRef<HTMLDivElement>(null)

  const execCommand = useCallback((cmd: string, arg?: string, needsArg?: boolean) => {
    if (needsArg) {
      const val = prompt("Enter URL:")
      if (!val) return
      document.execCommand(cmd, false, val)
    } else if (arg) {
      document.execCommand(cmd, false, arg)
    } else {
      document.execCommand(cmd, false)
    }
    updateOutput()
  }, [])

  const updateOutput = useCallback(() => {
    if (editorRef.current) {
      setHtmlOutput(editorRef.current.innerHTML)
    }
  }, [])

  return (
    <div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2px",
        padding: "0.4rem",
        background: "var(--bg-tertiary)",
        border: "1px solid var(--border-color)",
        marginBottom: "0.75rem",
      }}>
        {TOOLBAR_BUTTONS.map((btn, i) => {
          if (btn.cmd === "separator") {
            return <div key={i} style={{ width: "1px", background: "var(--border-color)", margin: "0 4px" }} />
          }
          return (
            <button
              key={i}
              onClick={() => execCommand(btn.cmd, "arg" in btn ? btn.arg : undefined, "needsArg" in btn ? btn.needsArg : undefined)}
              style={{
                padding: "0.25rem 0.5rem",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                borderRadius: 0,
                ...("style" in btn ? btn.style : {}),
              }}
            >
              {btn.label}
            </button>
          )
        })}
      </div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Editor</p>
          <div
            ref={editorRef}
            contentEditable
            onInput={updateOutput}
            onKeyUp={updateOutput}
            style={{
              minHeight: "300px",
              padding: "0.75rem",
              border: "1px solid var(--border-color)",
              background: "var(--bg-primary)",
              color: "var(--text-primary)",
              outline: "none",
              fontFamily: "inherit",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              overflow: "auto",
            }}
          />
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">HTML Output</p>
            {htmlOutput && <CopyButton text={htmlOutput} />}
          </div>
          <textarea
            value={htmlOutput}
            readOnly
            rows={16}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: "0.8rem",
              background: "var(--bg-secondary)",
              minHeight: "300px",
            }}
          />
        </div>
      </div>
    </div>
  )
}
