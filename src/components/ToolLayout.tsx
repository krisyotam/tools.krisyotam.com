"use client"

import type { ReactNode } from "react"

interface ToolLayoutProps {
  name: string
  description: string
  children: ReactNode
}

export function ToolLayout({ name, description, children }: ToolLayoutProps) {
  return (
    <div className="tool-content">
      <div className="tool-header">
        <h1>{name}</h1>
        <p>{description}</p>
      </div>
      <div className="mdx-content">
        {children}
      </div>
    </div>
  )
}
