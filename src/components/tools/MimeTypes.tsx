"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

const MIME_MAP: Record<string, string> = {
  html: "text/html",
  htm: "text/html",
  css: "text/css",
  js: "application/javascript",
  mjs: "application/javascript",
  json: "application/json",
  xml: "application/xml",
  csv: "text/csv",
  txt: "text/plain",
  md: "text/markdown",
  yaml: "application/x-yaml",
  yml: "application/x-yaml",
  toml: "application/toml",
  ini: "text/plain",
  log: "text/plain",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  ico: "image/x-icon",
  bmp: "image/bmp",
  tiff: "image/tiff",
  tif: "image/tiff",
  avif: "image/avif",
  pdf: "application/pdf",
  zip: "application/zip",
  gz: "application/gzip",
  tar: "application/x-tar",
  "7z": "application/x-7z-compressed",
  rar: "application/vnd.rar",
  bz2: "application/x-bzip2",
  xz: "application/x-xz",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  flac: "audio/flac",
  aac: "audio/aac",
  m4a: "audio/mp4",
  wma: "audio/x-ms-wma",
  mp4: "video/mp4",
  webm: "video/webm",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
  mov: "video/quicktime",
  flv: "video/x-flv",
  wmv: "video/x-ms-wmv",
  woff: "font/woff",
  woff2: "font/woff2",
  ttf: "font/ttf",
  otf: "font/otf",
  eot: "application/vnd.ms-fontobject",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  wasm: "application/wasm",
  sh: "application/x-sh",
  py: "text/x-python",
  rb: "text/x-ruby",
  java: "text/x-java-source",
  c: "text/x-c",
  cpp: "text/x-c++src",
  h: "text/x-c",
  rs: "text/x-rust",
  go: "text/x-go",
  ts: "application/typescript",
  tsx: "application/typescript",
  jsx: "application/javascript",
  sql: "application/sql",
  ics: "text/calendar",
  vcf: "text/vcard",
  rtf: "application/rtf",
  epub: "application/epub+zip",
}

function lookup(query: string): { ext: string; mime: string }[] {
  const q = query.trim().toLowerCase().replace(/^\./, "")
  if (!q) return []

  const results: { ext: string; mime: string }[] = []

  // Check if query matches an extension
  for (const [ext, mime] of Object.entries(MIME_MAP)) {
    if (ext === q) {
      results.push({ ext: `.${ext}`, mime })
    }
  }

  // Check if query matches a MIME type (exact or partial)
  for (const [ext, mime] of Object.entries(MIME_MAP)) {
    if (mime === q || mime.includes(q)) {
      const already = results.find(r => r.ext === `.${ext}` && r.mime === mime)
      if (!already) results.push({ ext: `.${ext}`, mime })
    }
  }

  // Partial extension match
  if (results.length === 0) {
    for (const [ext, mime] of Object.entries(MIME_MAP)) {
      if (ext.includes(q)) {
        results.push({ ext: `.${ext}`, mime })
      }
    }
  }

  return results
}

export function MimeTypesTool() {
  const [query, setQuery] = useState("")

  const results = lookup(query)

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Extension or MIME type</label>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. png, application/json, video..."
          />
        </div>
      </div>

      {results.length > 0 && (
        <div className="tool-section">
          <p className="tool-section-title">Results ({results.length})</p>
          {results.map((r, i) => (
            <div className="tool-output-row" key={i}>
              <span className="tool-output-label" style={{ fontFamily: "monospace", minWidth: "80px" }}>{r.ext}</span>
              <span className="tool-output-value" style={{ fontFamily: "monospace", fontSize: "0.82rem" }}>{r.mime}</span>
              <CopyButton text={r.mime} />
            </div>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          No matching MIME types found.
        </p>
      )}
    </div>
  )
}
