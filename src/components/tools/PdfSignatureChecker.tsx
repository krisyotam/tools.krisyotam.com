"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface SignatureInfo {
  hasSigs: boolean
  count: number
  subFilters: string[]
  byteRanges: string[]
}

function checkSignatures(buffer: ArrayBuffer): SignatureInfo {
  const bytes = new Uint8Array(buffer)
  const text = new TextDecoder("latin1").decode(bytes)

  const sigMatches = text.match(/\/Sig\b/g)
  const count = sigMatches ? sigMatches.length : 0

  const subFilters: string[] = []
  const sfRegex = /\/SubFilter\s*\/([\w.]+)/g
  let m: RegExpExecArray | null
  while ((m = sfRegex.exec(text)) !== null) {
    if (!subFilters.includes(m[1])) subFilters.push(m[1])
  }

  const byteRanges: string[] = []
  const brRegex = /\/ByteRange\s*\[([^\]]+)\]/g
  while ((m = brRegex.exec(text)) !== null) {
    byteRanges.push(m[1].trim())
  }

  return {
    hasSigs: count > 0,
    count,
    subFilters,
    byteRanges,
  }
}

export function PdfSignatureCheckerTool() {
  const [result, setResult] = useState<SignatureInfo | null>(null)
  const [fileName, setFileName] = useState("")
  const [error, setError] = useState("")

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setError("")
    try {
      const buffer = await file.arrayBuffer()
      const info = checkSignatures(buffer)
      setResult(info)
    } catch {
      setError("Failed to read file")
      setResult(null)
    }
  }

  const summaryText = result
    ? `Signatures: ${result.hasSigs ? "Yes" : "No"}\nCount: ${result.count}\nSubFilters: ${result.subFilters.join(", ") || "None"}\nByteRanges: ${result.byteRanges.length}`
    : ""

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Upload PDF</p>
          <div className="tool-field">
            <label>PDF File</label>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFile}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </div>
          {fileName && (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
              Loaded: {fileName}
            </p>
          )}
          {error && (
            <p style={{ fontSize: "0.8rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
          )}
        </div>

        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">Results</p>
            {result && <CopyButton text={summaryText} />}
          </div>
          {!result ? (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Upload a PDF file to check for digital signatures.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div className="tool-output-row">
                <span className="tool-output-label">Has Signatures</span>
                <span className="tool-output-value">{result.hasSigs ? "Yes" : "No"}</span>
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">Signature Count</span>
                <span className="tool-output-value">{result.count}</span>
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">SubFilter Types</span>
                <span className="tool-output-value">
                  {result.subFilters.length > 0 ? result.subFilters.join(", ") : "None"}
                </span>
              </div>
              {result.byteRanges.length > 0 && (
                <div className="tool-output-row">
                  <span className="tool-output-label">ByteRanges</span>
                  <span className="tool-output-value" style={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {result.byteRanges.map((br, i) => (
                      <span key={i} style={{ display: "block" }}>[{br}]</span>
                    ))}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
