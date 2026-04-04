"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Upload, Download, Lock, Unlock, X } from "lucide-react"

type AspectRatio = "free" | "1:1" | "4:3" | "16:9" | "3:2"

interface CropRect {
  x: number
  y: number
  w: number
  h: number
}

const ASPECT_RATIOS: { label: AspectRatio; value: number | null }[] = [
  { label: "free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:2", value: 3 / 2 },
]

const MAX_CANVAS_HEIGHT = 400

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function ImageCropTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [fileName, setFileName] = useState("cropped.png")
  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [displayW, setDisplayW] = useState(0)
  const [displayH, setDisplayH] = useState(0)
  const [scale, setScale] = useState(1)
  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 0, h: 0 })
  const [aspect, setAspect] = useState<AspectRatio>("free")
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isDragOver, setIsDragOver] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAspectValue = useCallback(() => {
    return ASPECT_RATIOS.find((a) => a.label === aspect)?.value ?? null
  }, [aspect])

  const loadImage = useCallback((file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      const img = new Image()
      img.onload = () => {
        imgRef.current = img
        setNaturalW(img.naturalWidth)
        setNaturalH(img.naturalHeight)

        // Compute display size to fit within container
        const containerWidth = containerRef.current?.clientWidth || 600
        const maxW = containerWidth
        const maxH = MAX_CANVAS_HEIGHT

        let dw = img.naturalWidth
        let dh = img.naturalHeight

        if (dw > maxW) {
          dh = (dh * maxW) / dw
          dw = maxW
        }
        if (dh > maxH) {
          dw = (dw * maxH) / dh
          dh = maxH
        }

        dw = Math.floor(dw)
        dh = Math.floor(dh)

        const s = img.naturalWidth / dw
        setDisplayW(dw)
        setDisplayH(dh)
        setScale(s)
        setImageSrc(src)
        setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight })
        setFileName(file.name.replace(/\.[^.]+$/, "") + "-cropped.png")
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  }, [])

  // Draw the canvas whenever image or crop changes
  useEffect(() => {
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!canvas || !img || !imageSrc) return

    canvas.width = displayW
    canvas.height = displayH

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Draw scaled image
    ctx.drawImage(img, 0, 0, displayW, displayH)

    // Draw dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)"
    ctx.fillRect(0, 0, displayW, displayH)

    // Clear the crop area (show image through)
    const cx = crop.x / scale
    const cy = crop.y / scale
    const cw = crop.w / scale
    const ch = crop.h / scale

    ctx.clearRect(cx, cy, cw, ch)
    ctx.drawImage(
      img,
      crop.x, crop.y, crop.w, crop.h,
      cx, cy, cw, ch
    )

    // Draw crop border
    ctx.strokeStyle = "var(--text-muted)"
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    ctx.strokeRect(cx, cy, cw, ch)

    // Draw corner handles
    const handleSize = 8
    ctx.fillStyle = "var(--text-muted)"
    const corners = [
      [cx, cy],
      [cx + cw - handleSize, cy],
      [cx, cy + ch - handleSize],
      [cx + cw - handleSize, cy + ch - handleSize],
    ]
    for (const [hx, hy] of corners) {
      ctx.fillRect(hx, hy, handleSize, handleSize)
    }

    // Draw rule-of-thirds lines
    ctx.strokeStyle = "rgba(128, 128, 128, 0.3)"
    ctx.lineWidth = 0.5
    for (let i = 1; i <= 2; i++) {
      ctx.beginPath()
      ctx.moveTo(cx + (cw * i) / 3, cy)
      ctx.lineTo(cx + (cw * i) / 3, cy + ch)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx, cy + (ch * i) / 3)
      ctx.lineTo(cx + cw, cy + (ch * i) / 3)
      ctx.stroke()
    }
  }, [imageSrc, crop, displayW, displayH, scale])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setDragging(true)
      setDragStart({ x, y })
      setCrop({ x: Math.round(x * scale), y: Math.round(y * scale), w: 0, h: 0 })
    },
    [scale]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!dragging) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const mx = clamp(e.clientX - rect.left, 0, displayW)
      const my = clamp(e.clientY - rect.top, 0, displayH)

      let w = Math.round((mx - dragStart.x) * scale)
      let h = Math.round((my - dragStart.y) * scale)

      const aspectVal = getAspectValue()
      if (aspectVal !== null) {
        // Constrain to aspect ratio based on the larger dimension
        if (Math.abs(w) / aspectVal > Math.abs(h)) {
          h = Math.round(Math.sign(h || 1) * Math.abs(w) / aspectVal)
        } else {
          w = Math.round(Math.sign(w || 1) * Math.abs(h) * aspectVal)
        }
      }

      let sx = Math.round(dragStart.x * scale)
      let sy = Math.round(dragStart.y * scale)
      let fw = w
      let fh = h

      // Normalize negative dimensions
      if (fw < 0) { sx += fw; fw = -fw }
      if (fh < 0) { sy += fh; fh = -fh }

      // Clamp to image bounds
      sx = clamp(sx, 0, naturalW)
      sy = clamp(sy, 0, naturalH)
      fw = clamp(fw, 0, naturalW - sx)
      fh = clamp(fh, 0, naturalH - sy)

      setCrop({ x: sx, y: sy, w: fw, h: fh })
    },
    [dragging, dragStart, scale, displayW, displayH, naturalW, naturalH, getAspectValue]
  )

  const handleMouseUp = useCallback(() => {
    setDragging(false)
  }, [])

  // Touch support
  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect || !e.touches[0]) return null
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  }

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      const pos = getTouchPos(e)
      if (!pos) return
      setDragging(true)
      setDragStart(pos)
      setCrop({ x: Math.round(pos.x * scale), y: Math.round(pos.y * scale), w: 0, h: 0 })
    },
    [scale]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLCanvasElement>) => {
      e.preventDefault()
      if (!dragging) return
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect || !e.touches[0]) return

      const mx = clamp(e.touches[0].clientX - rect.left, 0, displayW)
      const my = clamp(e.touches[0].clientY - rect.top, 0, displayH)

      let w = Math.round((mx - dragStart.x) * scale)
      let h = Math.round((my - dragStart.y) * scale)

      const aspectVal = getAspectValue()
      if (aspectVal !== null) {
        if (Math.abs(w) / aspectVal > Math.abs(h)) {
          h = Math.round(Math.sign(h || 1) * Math.abs(w) / aspectVal)
        } else {
          w = Math.round(Math.sign(w || 1) * Math.abs(h) * aspectVal)
        }
      }

      let sx = Math.round(dragStart.x * scale)
      let sy = Math.round(dragStart.y * scale)
      let fw = w
      let fh = h

      if (fw < 0) { sx += fw; fw = -fw }
      if (fh < 0) { sy += fh; fh = -fh }

      sx = clamp(sx, 0, naturalW)
      sy = clamp(sy, 0, naturalH)
      fw = clamp(fw, 0, naturalW - sx)
      fh = clamp(fh, 0, naturalH - sy)

      setCrop({ x: sx, y: sy, w: fw, h: fh })
    },
    [dragging, dragStart, scale, displayW, displayH, naturalW, naturalH, getAspectValue]
  )

  const handleTouchEnd = useCallback(() => {
    setDragging(false)
  }, [])

  const updateCropField = useCallback(
    (field: keyof CropRect, value: number) => {
      setCrop((prev) => {
        const next = { ...prev, [field]: value }
        const aspectVal = getAspectValue()

        // Clamp position
        next.x = clamp(next.x, 0, naturalW)
        next.y = clamp(next.y, 0, naturalH)
        next.w = clamp(next.w, 0, naturalW - next.x)
        next.h = clamp(next.h, 0, naturalH - next.y)

        // Enforce aspect ratio when width or height changes
        if (aspectVal !== null) {
          if (field === "w") {
            next.h = Math.round(next.w / aspectVal)
            next.h = clamp(next.h, 0, naturalH - next.y)
            next.w = Math.round(next.h * aspectVal)
          } else if (field === "h") {
            next.w = Math.round(next.h * aspectVal)
            next.w = clamp(next.w, 0, naturalW - next.x)
            next.h = Math.round(next.w / aspectVal)
          }
        }

        return next
      })
    },
    [naturalW, naturalH, getAspectValue]
  )

  const handleCropDownload = useCallback(() => {
    const img = imgRef.current
    if (!img || crop.w === 0 || crop.h === 0) return

    const offscreen = document.createElement("canvas")
    offscreen.width = crop.w
    offscreen.height = crop.h
    const ctx = offscreen.getContext("2d")
    if (!ctx) return

    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h)

    offscreen.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, "image/png")
  }, [crop, fileName])

  const handleReset = useCallback(() => {
    setImageSrc(null)
    setFileName("cropped.png")
    setNaturalW(0)
    setNaturalH(0)
    setDisplayW(0)
    setDisplayH(0)
    setScale(1)
    setCrop({ x: 0, y: 0, w: 0, h: 0 })
    imgRef.current = null
    if (fileInputRef.current) fileInputRef.current.value = ""
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith("image/")) loadImage(file)
    },
    [loadImage]
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) loadImage(file)
    },
    [loadImage]
  )

  // Drop zone
  if (!imageSrc) {
    return (
      <div className="craft-block">
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "2px dashed var(--border-color)",
            background: isDragOver ? "var(--bg-tertiary)" : "var(--bg-secondary)",
            padding: "3rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            gap: "0.75rem",
            minHeight: "200px",
            transition: "background 0.15s",
          }}
        >
          <Upload size={32} style={{ color: "var(--text-muted)" }} />
          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.9rem" }}>
            Drop an image here or click to browse
          </span>
          <span style={{ color: "var(--text-muted)", fontFamily: "var(--font-sans)", fontSize: "0.75rem", opacity: 0.7 }}>
            Supports PNG, JPG, WebP, GIF, BMP, SVG
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: "none" }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="craft-block">
      <div className="craft-row" style={{ gap: "1.5rem", alignItems: "flex-start" }}>
        {/* Left: Canvas */}
        <div ref={containerRef} style={{ flex: "1 1 0", minWidth: 0 }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              display: "block",
              width: displayW,
              height: displayH,
              maxWidth: "100%",
              cursor: "crosshair",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              touchAction: "none",
            }}
          />
          <div style={{
            marginTop: "0.5rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
          }}>
            {naturalW} x {naturalH}px original
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{
          flex: "0 0 220px",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}>
          {/* Aspect Ratio */}
          <div>
            <label className="craft-label">Aspect Ratio</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.35rem" }}>
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.label}
                  onClick={() => setAspect(ar.label)}
                  style={{
                    background: aspect === ar.label ? "var(--border-color)" : "var(--bg-tertiary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                    borderRadius: 0,
                  }}
                >
                  {ar.label === "free" ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Unlock size={10} /> Free
                    </span>
                  ) : (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                      <Lock size={10} /> {ar.label}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Crop Dimensions */}
          <div>
            <label className="craft-label">Crop Region</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.35rem", marginTop: "0.35rem" }}>
              {(["x", "y", "w", "h"] as const).map((field) => {
                const labels: Record<string, string> = { x: "X", y: "Y", w: "W", h: "H" }
                return (
                  <div key={field} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      width: "1rem",
                      textAlign: "right",
                    }}>
                      {labels[field]}
                    </span>
                    <input
                      type="number"
                      className="craft-num"
                      value={crop[field]}
                      min={0}
                      max={field === "x" ? naturalW : field === "y" ? naturalH : field === "w" ? naturalW - crop.x : naturalH - crop.y}
                      onChange={(e) => updateCropField(field, parseInt(e.target.value) || 0)}
                      style={{
                        width: "100%",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.35rem",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-primary)",
                        borderRadius: 0,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Output Size */}
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            color: "var(--text-muted)",
            padding: "0.4rem 0.5rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}>
            Output: {crop.w} x {crop.h}px
          </div>

          {/* Buttons */}
          <button
            onClick={handleCropDownload}
            disabled={crop.w === 0 || crop.h === 0}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              background: crop.w > 0 && crop.h > 0 ? "var(--bg-tertiary)" : "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: crop.w > 0 && crop.h > 0 ? "var(--text-primary)" : "var(--text-muted)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              padding: "0.5rem 0.75rem",
              cursor: crop.w > 0 && crop.h > 0 ? "pointer" : "not-allowed",
              borderRadius: 0,
              width: "100%",
            }}
          >
            <Download size={14} />
            Crop & Download
          </button>

          <button
            onClick={handleReset}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              background: "var(--bg-tertiary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              padding: "0.5rem 0.75rem",
              cursor: "pointer",
              borderRadius: 0,
              width: "100%",
            }}
          >
            <X size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}
