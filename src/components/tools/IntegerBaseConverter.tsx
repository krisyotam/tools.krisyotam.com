"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

type Base = "decimal" | "hex" | "octal" | "binary"

const bases: { key: Base; label: string; radix: number; prefix: string }[] = [
  { key: "decimal", label: "Decimal", radix: 10, prefix: "" },
  { key: "hex", label: "Hexadecimal", radix: 16, prefix: "0x" },
  { key: "octal", label: "Octal", radix: 8, prefix: "0o" },
  { key: "binary", label: "Binary", radix: 2, prefix: "0b" },
]

export function IntegerBaseConverterTool() {
  const [values, setValues] = useState<Record<Base, string>>({
    decimal: "",
    hex: "",
    octal: "",
    binary: "",
  })
  const [error, setError] = useState("")

  const update = (source: Base, raw: string) => {
    setError("")
    if (!raw.trim()) {
      setValues({ decimal: "", hex: "", octal: "", binary: "" })
      return
    }

    const radix = bases.find(b => b.key === source)!.radix
    const cleaned = raw.trim().replace(/^0[xXoObB]/, "")
    const n = parseInt(cleaned, radix)

    if (isNaN(n)) {
      setError(`Invalid ${source} number`)
      setValues(prev => ({ ...prev, [source]: raw }))
      return
    }

    setValues({
      decimal: n.toString(10),
      hex: n.toString(16).toUpperCase(),
      octal: n.toString(8),
      binary: n.toString(2),
    })
  }

  return (
    <div>
      {bases.map(({ key, label, prefix }) => (
        <div className="tool-section" key={key}>
          <div className="tool-field">
            <label>{label}</label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {prefix && (
                <span style={{ color: "var(--text-muted)", fontFamily: "monospace", fontSize: "0.85rem" }}>
                  {prefix}
                </span>
              )}
              <input
                type="text"
                value={values[key]}
                onChange={e => update(key, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}...`}
                style={{ flex: 1, fontFamily: "monospace" }}
              />
              {values[key] && <CopyButton text={prefix + values[key]} />}
            </div>
          </div>
        </div>
      ))}

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}
    </div>
  )
}
