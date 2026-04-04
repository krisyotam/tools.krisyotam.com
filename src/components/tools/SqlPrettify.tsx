"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const KEYWORDS = [
  "SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "CROSS JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "ON", "ORDER BY", "GROUP BY", "HAVING", "INSERT", "UPDATE", "DELETE",
  "CREATE", "ALTER", "DROP", "AND", "OR", "IN", "NOT", "NULL", "AS", "SET",
  "VALUES", "INTO", "LIMIT", "OFFSET", "UNION", "UNION ALL", "DISTINCT",
  "BETWEEN", "LIKE", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END",
  "TABLE", "INDEX", "VIEW", "DATABASE", "IF", "PRIMARY KEY", "FOREIGN KEY",
  "REFERENCES", "CONSTRAINT", "DEFAULT", "CHECK", "UNIQUE", "CASCADE",
  "ASC", "DESC", "COUNT", "SUM", "AVG", "MIN", "MAX", "IS", "ALL", "ANY",
  "TOP", "WITH", "RECURSIVE", "OVER", "PARTITION BY", "ROW_NUMBER", "RANK",
  "DENSE_RANK", "TRIGGER", "PROCEDURE", "FUNCTION", "BEGIN", "COMMIT",
  "ROLLBACK", "TRANSACTION", "GRANT", "REVOKE",
]

const MAJOR_CLAUSES = [
  "SELECT", "FROM", "WHERE", "JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN",
  "FULL JOIN", "CROSS JOIN", "LEFT OUTER JOIN", "RIGHT OUTER JOIN", "FULL OUTER JOIN",
  "ORDER BY", "GROUP BY", "HAVING", "LIMIT", "OFFSET",
  "UNION", "UNION ALL", "INSERT", "UPDATE", "DELETE",
  "CREATE", "ALTER", "DROP", "SET", "VALUES", "INTO",
  "ON", "AND", "OR",
]

function formatSQL(sql: string): string {
  if (!sql.trim()) return ""

  // Normalize whitespace
  let formatted = sql.replace(/\s+/g, " ").trim()

  // Uppercase keywords (word-boundary matching)
  // Sort by length descending to match multi-word keywords first
  const sortedKeywords = [...KEYWORDS].sort((a, b) => b.length - a.length)
  for (const kw of sortedKeywords) {
    const escaped = kw.replace(/\s+/g, "\\s+")
    const regex = new RegExp(`\\b${escaped}\\b`, "gi")
    formatted = formatted.replace(regex, kw)
  }

  // Add newlines before major clauses
  const majorSorted = [...MAJOR_CLAUSES].sort((a, b) => b.length - a.length)
  for (const clause of majorSorted) {
    const escaped = clause.replace(/\s+/g, "\\s+")
    const regex = new RegExp(`\\s+${escaped}\\b`, "gi")
    formatted = formatted.replace(regex, `\n${clause}`)
  }

  // Indent ON, AND, OR
  const lines = formatted.split("\n")
  const result: string[] = []
  let indentLevel = 0

  for (let line of lines) {
    line = line.trim()
    if (!line) continue

    // Decrease indent for closing parens
    const openParens = (line.match(/\(/g) || []).length
    const closeParens = (line.match(/\)/g) || []).length

    if (line.startsWith("ON ") || line.startsWith("AND ") || line.startsWith("OR ")) {
      result.push("  ".repeat(indentLevel + 1) + line)
    } else {
      result.push("  ".repeat(indentLevel) + line)
    }

    indentLevel += openParens - closeParens
    if (indentLevel < 0) indentLevel = 0
  }

  return result.join("\n")
}

export function SqlPrettifyTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const format = () => {
    setOutput(formatSQL(input))
  }

  return (
    <div>
      <div className="tool-actions" style={{ marginBottom: "0.75rem" }}>
        <button onClick={format}>Format SQL</button>
      </div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">SQL Input</p>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={18}
            placeholder="SELECT * FROM users WHERE id = 1 ORDER BY name"
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">Formatted SQL</p>
            {output && <CopyButton text={output} />}
          </div>
          <textarea
            value={output}
            readOnly
            rows={18}
            placeholder="Formatted SQL will appear here..."
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.85rem", background: "var(--bg-secondary)" }}
          />
        </div>
      </div>
    </div>
  )
}
