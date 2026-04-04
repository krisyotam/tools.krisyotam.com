"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

type Perms = [boolean, boolean, boolean]

const permLabels = ["Read", "Write", "Execute"]
const roleLabels = ["Owner", "Group", "Other"]

function permsToOctal(p: Perms): number {
  return (p[0] ? 4 : 0) + (p[1] ? 2 : 0) + (p[2] ? 1 : 0)
}

function permsToSymbolic(p: Perms): string {
  return (p[0] ? "r" : "-") + (p[1] ? "w" : "-") + (p[2] ? "x" : "-")
}

export function ChmodCalculatorTool() {
  const [owner, setOwner] = useState<Perms>([true, true, false])
  const [group, setGroup] = useState<Perms>([true, false, false])
  const [other, setOther] = useState<Perms>([true, false, false])

  const roles: [Perms, (p: Perms) => void][] = [
    [owner, setOwner],
    [group, setGroup],
    [other, setOther],
  ]

  const numeric = `${permsToOctal(owner)}${permsToOctal(group)}${permsToOctal(other)}`
  const symbolic = `-${permsToSymbolic(owner)}${permsToSymbolic(group)}${permsToSymbolic(other)}`

  return (
    <div>
      <div className="tool-section">
        {roles.map(([perms, setPerms], ri) => (
          <div key={ri} style={{ marginBottom: "0.75rem" }}>
            <p style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginBottom: "0.35rem", fontWeight: 500 }}>{roleLabels[ri]}</p>
            <div className="tool-toggles">
              {permLabels.map((label, pi) => (
                <label key={pi} className="tool-toggle">
                  <input
                    type="checkbox"
                    checked={perms[pi]}
                    onChange={() => {
                      const next: Perms = [...perms]
                      next[pi] = !next[pi]
                      setPerms(next)
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="tool-section">
        <div className="tool-output-row">
          <span className="tool-output-label">Numeric</span>
          <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{numeric}</span>
          <CopyButton text={numeric} />
        </div>
        <div className="tool-output-row">
          <span className="tool-output-label">Symbolic</span>
          <span className="tool-output-value" style={{ fontFamily: "monospace" }}>{symbolic}</span>
          <CopyButton text={symbolic} />
        </div>
        <div className="tool-output-row">
          <span className="tool-output-label">Command</span>
          <span className="tool-output-value" style={{ fontFamily: "monospace" }}>chmod {numeric} file</span>
          <CopyButton text={`chmod ${numeric} file`} />
        </div>
      </div>
    </div>
  )
}
