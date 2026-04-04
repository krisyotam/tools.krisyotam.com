"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, Download, X } from "lucide-react"

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / 1048576).toFixed(2) + " MB"
}

export function ImageWebpToJpg() {
  const [file, setFile] = useState<File | null>(null)
  const [inputUrl, setInputUrl] = useState<string | null>(null)
  const [outputUrl, setOutputUrl] = useState<string | null>(null)
  const [outputSize, setOutputSize] = useState<number>(0)
  const [quality, setQuality] = useState(92)
  const [converting, setConverting] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const reset = () => {
    if (inputUrl) URL.revokeObjectURL(inputUrl)
    if (outputUrl) URL.revokeObjectURL(outputUrl)
    setFile(null)
    setInputUrl(null)
    setOutputUrl(null)
    setOutputSize(0)
  }

  const convert = useCallback(async (f: File, q: number) => {
    setConverting(true)
    const url = URL.createObjectURL(f)
    setInputUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return url })

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext("2d")!
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setOutputUrl((prev) => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(blob) })
            setOutputSize(blob.size)
          }
          setConverting(false)
        },
        "image/jpeg",
        q / 100
      )
    }
    img.onerror = () => setConverting(false)
    img.src = url
  }, [])

  const handleFile = (f: File) => {
    reset()
    setFile(f)
    convert(f, quality)
  }

  const handleQualityChange = (q: number) => {
    setQuality(q)
    if (file) convert(file, q)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const outputName = file ? file.name.replace(/\.webp$/i, ".jpg") : "output.jpg"

  return (
    <div className="craft-block">
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: "1px dashed var(--border-color)",
            background: dragOver ? "var(--bg-tertiary)" : "var(--bg-secondary)",
            padding: "2.5rem 1rem",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <Upload size={24} style={{ margin: "0 auto 0.5rem", color: "var(--text-muted)" }} />
          <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Drop a .webp file here or click to browse
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".webp,image/webp"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>
      ) : (
        <>
          <div className="craft-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <span className="craft-label">input</span>
              <div style={{ marginTop: "0.35rem" }}>
                {inputUrl && (
                  <img
                    src={inputUrl}
                    alt="Input"
                    style={{ maxHeight: 200, objectFit: "contain", border: "1px solid var(--border-color)" }}
                  />
                )}
                <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {file.name} — {formatBytes(file.size)}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, marginLeft: "1rem" }}>
              <span className="craft-label">output</span>
              <div style={{ marginTop: "0.35rem" }}>
                {outputUrl && (
                  <img
                    src={outputUrl}
                    alt="Output"
                    style={{ maxHeight: 200, objectFit: "contain", border: "1px solid var(--border-color)" }}
                  />
                )}
                {outputSize > 0 && (
                  <div style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                    {outputName} — {formatBytes(outputSize)}
                    {file && (
                      <span style={{ marginLeft: "0.5rem" }}>
                        ({outputSize < file.size ? "-" : "+"}{Math.abs(Math.round((1 - outputSize / file.size) * 100))}%)
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="craft-row" style={{ marginTop: "0.75rem", alignItems: "center", gap: "0.75rem" }}>
            <span className="craft-label" style={{ marginBottom: 0 }}>quality</span>
            <input
              type="range"
              min={1}
              max={100}
              value={quality}
              onChange={(e) => handleQualityChange(Number(e.target.value))}
              style={{ flex: 1, maxWidth: 200 }}
            />
            <span style={{ fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", minWidth: "2rem" }}>
              {quality}
            </span>
          </div>

          <div className="craft-row" style={{ marginTop: "0.5rem", gap: "0.5rem" }}>
            {outputUrl && (
              <a
                href={outputUrl}
                download={outputName}
                className="craft-copy-btn"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.75rem", textDecoration: "none" }}
              >
                <Download size={12} /> Download .jpg
              </a>
            )}
            <button onClick={reset} className="craft-copy-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.3rem 0.75rem" }}>
              <X size={12} /> Clear
            </button>
            {converting && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Converting...</span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
