"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function markdownToHtml(md: string): string {
  let html = md

  // Code blocks (``` ... ```) — must come before inline code
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre><code>${escapeHtml(code.trimEnd())}</code></pre>`
  })

  // Split into blocks for paragraph handling
  const blocks = html.split(/\n\n+/)
  const processed = blocks.map(block => {
    // Skip pre blocks
    if (block.startsWith("<pre>")) return block

    // Headers
    block = block.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>")
    block = block.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>")
    block = block.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>")
    block = block.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>")
    block = block.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>")
    block = block.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>")

    // Horizontal rules
    block = block.replace(/^[-*_]{3,}\s*$/gm, "<hr>")

    // Blockquotes
    block = block.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>")

    // Unordered lists
    if (/^[-*+]\s+/m.test(block)) {
      const items = block.split("\n")
        .filter(l => /^[-*+]\s+/.test(l))
        .map(l => `<li>${l.replace(/^[-*+]\s+/, "")}</li>`)
        .join("\n")
      block = `<ul>\n${items}\n</ul>`
    }

    // Ordered lists
    if (/^\d+\.\s+/m.test(block) && !block.startsWith("<")) {
      const items = block.split("\n")
        .filter(l => /^\d+\.\s+/.test(l))
        .map(l => `<li>${l.replace(/^\d+\.\s+/, "")}</li>`)
        .join("\n")
      block = `<ol>\n${items}\n</ol>`
    }

    // Inline code
    block = block.replace(/`([^`]+)`/g, "<code>$1</code>")

    // Bold + italic
    block = block.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    block = block.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    block = block.replace(/\*(.+?)\*/g, "<em>$1</em>")
    block = block.replace(/__(.+?)__/g, "<strong>$1</strong>")
    block = block.replace(/_(.+?)_/g, "<em>$1</em>")
    block = block.replace(/~~(.+?)~~/g, "<del>$1</del>")

    // Images (before links)
    block = block.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')

    // Links
    block = block.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

    // Line breaks
    block = block.replace(/  \n/g, "<br>\n")

    // Wrap plain text blocks in <p>
    if (!block.startsWith("<") && block.trim()) {
      block = `<p>${block}</p>`
    }

    return block
  })

  return processed.join("\n\n")
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export function MarkdownToHtmlTool() {
  const [markdown, setMarkdown] = useState("")
  const [showPreview, setShowPreview] = useState(true)

  const html = markdown ? markdownToHtml(markdown) : ""

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Markdown</label>
          <textarea
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            rows={10}
            placeholder={"# Hello World\n\nThis is **bold** and *italic* text.\n\n- Item one\n- Item two\n\n[Link](https://example.com)"}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
      </div>

      <div className="tool-section">
        <div className="tool-toggles">
          <label className="tool-toggle">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={e => setShowPreview(e.target.checked)}
            />
            Show rendered preview
          </label>
        </div>
      </div>

      {showPreview && html && (
        <div className="tool-section">
          <div className="tool-field">
            <label>Preview</label>
            <div
              style={{
                padding: "0.75rem",
                border: "1px solid var(--border-color)",
                background: "var(--bg-secondary)",
                minHeight: "4rem",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </div>
      )}

      <div className="tool-section">
        <div className="tool-field">
          <label>HTML output</label>
          <textarea
            value={html}
            readOnly
            rows={10}
            placeholder="HTML output will appear here..."
            style={{ fontFamily: "monospace", fontSize: "0.82rem", background: "var(--bg-secondary)" }}
          />
        </div>
        {html && (
          <div className="tool-actions">
            <CopyButton text={html} />
          </div>
        )}
      </div>
    </div>
  )
}
