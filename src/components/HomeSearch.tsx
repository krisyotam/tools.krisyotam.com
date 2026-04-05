"use client"

import { useState } from "react"
import Link from "next/link"

interface ToolInfo {
  name: string
  slug: string
  description: string
  category: string
}

export function HomeSearch({ tools }: { tools: ToolInfo[] }) {
  const [query, setQuery] = useState("")

  const lq = query.toLowerCase()
  const results = lq
    ? tools.filter(t =>
        t.name.toLowerCase().includes(lq) ||
        t.description.toLowerCase().includes(lq) ||
        t.category.toLowerCase().includes(lq)
      )
    : []

  return (
    <div style={{
      flex: 1,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: query ? "flex-start" : "center",
      padding: query ? "2rem 2rem 0" : "0 2rem",
      overflow: "hidden",
      transition: "justify-content 0.2s",
    }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tools..."
          autoFocus
          style={{
            padding: "0.75rem 1rem",
            fontSize: "0.88rem",
            fontFamily: "var(--font-sans), 'IBM Plex Sans', system-ui, sans-serif",
          }}
        />
        {!query && (
          <p style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "0.75rem",
          }}>
            {tools.length} browser utilities. Search or pick from the sidebar.
          </p>
        )}
      </div>

      {query && (
        <div style={{
          width: "100%",
          maxWidth: 520,
          marginTop: "0.75rem",
          flex: 1,
          overflowY: "auto",
        }}>
          {results.length === 0 && (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginTop: "1.5rem" }}>
              No tools match "{query}"
            </p>
          )}
          {results.map(tool => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                padding: "0.55rem 0",
                borderBottom: "1px solid var(--border-color)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span style={{
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
              }}>
                {tool.name}
              </span>
              <span style={{
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {tool.description}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
