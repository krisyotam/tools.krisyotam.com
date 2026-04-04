"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [image, setImage] = useState("")
  const [ogType, setOgType] = useState("website")
  const [twitterCard, setTwitterCard] = useState("summary_large_image")

  const generateMeta = () => {
    const lines: string[] = []
    lines.push(`<!-- Primary Meta Tags -->`)
    if (title) lines.push(`<title>${title}</title>`)
    if (title) lines.push(`<meta name="title" content="${title}" />`)
    if (description) lines.push(`<meta name="description" content="${description}" />`)
    lines.push("")
    lines.push(`<!-- Open Graph / Facebook -->`)
    lines.push(`<meta property="og:type" content="${ogType}" />`)
    if (url) lines.push(`<meta property="og:url" content="${url}" />`)
    if (title) lines.push(`<meta property="og:title" content="${title}" />`)
    if (description) lines.push(`<meta property="og:description" content="${description}" />`)
    if (image) lines.push(`<meta property="og:image" content="${image}" />`)
    lines.push("")
    lines.push(`<!-- Twitter -->`)
    lines.push(`<meta property="twitter:card" content="${twitterCard}" />`)
    if (url) lines.push(`<meta property="twitter:url" content="${url}" />`)
    if (title) lines.push(`<meta property="twitter:title" content="${title}" />`)
    if (description) lines.push(`<meta property="twitter:description" content="${description}" />`)
    if (image) lines.push(`<meta property="twitter:image" content="${image}" />`)
    return lines.join("\n")
  }

  const output = generateMeta()

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Inputs</p>
          <div className="tool-field">
            <label>Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="My Website" />
          </div>
          <div className="tool-field">
            <label>Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="A brief description of your page..." />
          </div>
          <div className="tool-field">
            <label>URL</label>
            <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com" />
          </div>
          <div className="tool-field">
            <label>Image URL</label>
            <input type="text" value={image} onChange={e => setImage(e.target.value)} placeholder="https://example.com/image.png" />
          </div>
          <div className="tool-row">
            <div className="tool-field" style={{ flex: 1 }}>
              <label>OG Type</label>
              <select value={ogType} onChange={e => setOgType(e.target.value)}>
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="profile">profile</option>
              </select>
            </div>
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Twitter Card</label>
              <select value={twitterCard} onChange={e => setTwitterCard(e.target.value)}>
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </div>
          </div>
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p className="tool-section-title">Generated Meta Tags</p>
            <CopyButton text={output} />
          </div>
          <textarea
            value={output}
            readOnly
            rows={20}
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.8rem", background: "var(--bg-secondary)" }}
          />
        </div>
      </div>
    </div>
  )
}
