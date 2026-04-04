"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

export function BasicAuthGeneratorTool() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const encoded = username || password
    ? btoa(`${username}:${password}`)
    : ""
  const header = encoded ? `Basic ${encoded}` : ""

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="admin"
          />
        </div>
        <div className="tool-field">
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="secret"
          />
        </div>
      </div>

      {header && (
        <div className="tool-section">
          <p className="tool-section-title">Authorization header</p>
          <div className="tool-output-row">
            <span className="tool-output-label">Header value</span>
            <span className="tool-output-value" style={{ wordBreak: "break-all" }}>{header}</span>
            <CopyButton text={header} />
          </div>
          <div className="tool-output-row">
            <span className="tool-output-label">Base64</span>
            <span className="tool-output-value" style={{ wordBreak: "break-all" }}>{encoded}</span>
            <CopyButton text={encoded} />
          </div>
        </div>
      )}
    </div>
  )
}
