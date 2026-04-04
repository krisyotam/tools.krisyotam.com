"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function Base64FileConverterTool() {
  const [base64Output, setBase64Output] = useState("")
  const [fileSize, setFileSize] = useState("")
  const [fileName, setFileName] = useState("")

  const [base64Input, setBase64Input] = useState("")
  const [downloadName, setDownloadName] = useState("file.bin")
  const [decodeError, setDecodeError] = useState("")

  const handleFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const kb = (file.size / 1024).toFixed(2)
    setFileSize(file.size < 1024 ? `${file.size} B` : `${kb} KB`)
    const reader = new FileReader()
    reader.onload = () => {
      setBase64Output(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDownload = () => {
    setDecodeError("")
    try {
      let data = base64Input.trim()
      let mimeType = "application/octet-stream"

      if (data.startsWith("data:")) {
        const commaIdx = data.indexOf(",")
        const header = data.substring(0, commaIdx)
        const mimeMatch = header.match(/data:([^;]+)/)
        if (mimeMatch) mimeType = mimeMatch[1]
        data = data.substring(commaIdx + 1)
      }

      const binary = atob(data)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = downloadName || "file.bin"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      setDecodeError("Invalid base64 string")
    }
  }

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">File to Base64</p>
          <div className="tool-field">
            <label>Select File</label>
            <input
              type="file"
              onChange={handleFileToBase64}
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </div>
          {fileName && (
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
              {fileName} ({fileSize})
            </p>
          )}
          <div className="tool-field" style={{ marginTop: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label>Base64 Output</label>
              {base64Output && <CopyButton text={base64Output} />}
            </div>
            <textarea
              value={base64Output}
              readOnly
              rows={10}
              placeholder="Base64 encoded string will appear here..."
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem" }}
            />
          </div>
        </div>

        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Base64 to File</p>
          <div className="tool-field">
            <label>Base64 String</label>
            <textarea
              value={base64Input}
              onChange={e => { setBase64Input(e.target.value); setDecodeError("") }}
              rows={10}
              placeholder="Paste base64 string here (with or without data URI prefix)..."
              style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem" }}
            />
          </div>
          <div className="tool-field" style={{ marginTop: "0.5rem" }}>
            <label>Filename</label>
            <input
              type="text"
              value={downloadName}
              onChange={e => setDownloadName(e.target.value)}
              placeholder="file.bin"
              style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
            />
          </div>
          {decodeError && (
            <p style={{ fontSize: "0.8rem", color: "hsl(0 70% 55%)", marginTop: "0.25rem" }}>{decodeError}</p>
          )}
          <div className="tool-actions" style={{ marginTop: "0.5rem" }}>
            <button onClick={handleDownload} disabled={!base64Input.trim()}>
              Download File
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
