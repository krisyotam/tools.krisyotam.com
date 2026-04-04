import type { ReactNode } from "react"

export function Box({ children }: { children: ReactNode }) {
  return (
    <div className="prompt-collapse">
      {/* Top bar */}
      <div className="prompt-collapse-header">
        <span className="prompt-collapse-title">Prompt</span>
      </div>
      {/* Content with left accent strip */}
      <div className="prompt-collapse-body">
        <div className="prompt-collapse-strip" />
        <div className="prompt-collapse-content">
          {children}
        </div>
      </div>
      {/* Bottom bar */}
      <div className="prompt-collapse-footer" />
    </div>
  )
}
