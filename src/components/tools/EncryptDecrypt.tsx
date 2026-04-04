"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  )
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  )
}

async function encrypt(plaintext: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(password, salt)
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(plaintext)
  )
  // Concatenate salt + iv + ciphertext, then base64
  const combined = new Uint8Array(salt.length + iv.length + new Uint8Array(ciphertext).length)
  combined.set(salt, 0)
  combined.set(iv, salt.length)
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length)
  return btoa(String.fromCharCode(...combined))
}

async function decrypt(encoded: string, password: string): Promise<string> {
  const raw = Uint8Array.from(atob(encoded), c => c.charCodeAt(0))
  const salt = raw.slice(0, 16)
  const iv = raw.slice(16, 28)
  const ciphertext = raw.slice(28)
  const key = await deriveKey(password, salt)
  const plainBuffer = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  )
  return new TextDecoder().decode(plainBuffer)
}

export function EncryptDecryptTool() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt")
  const [input, setInput] = useState("")
  const [password, setPassword] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const handleRun = async () => {
    setError("")
    setOutput("")
    if (!input || !password) {
      setError("Both input and password are required.")
      return
    }
    try {
      if (mode === "encrypt") {
        setOutput(await encrypt(input, password))
      } else {
        setOutput(await decrypt(input, password))
      }
    } catch {
      setError(mode === "encrypt" ? "Encryption failed." : "Decryption failed. Wrong password or corrupted data.")
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-toggles">
          <label className="tool-toggle">
            <input
              type="radio"
              name="mode"
              checked={mode === "encrypt"}
              onChange={() => { setMode("encrypt"); setOutput(""); setError("") }}
            />
            Encrypt
          </label>
          <label className="tool-toggle">
            <input
              type="radio"
              name="mode"
              checked={mode === "decrypt"}
              onChange={() => { setMode("decrypt"); setOutput(""); setError("") }}
            />
            Decrypt
          </label>
        </div>
        <div className="tool-field">
          <label>{mode === "encrypt" ? "Plaintext" : "Ciphertext (base64)"}</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={4}
            placeholder={mode === "encrypt" ? "Text to encrypt..." : "Paste base64 ciphertext..."}
          />
        </div>
        <div className="tool-field">
          <label>Password</label>
          <input
            type="text"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Encryption password"
          />
        </div>
        <div className="tool-actions">
          <button onClick={handleRun}>{mode === "encrypt" ? "Encrypt" : "Decrypt"}</button>
        </div>
      </div>

      {error && <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>}

      {output && (
        <div className="tool-section">
          <p className="tool-section-title">{mode === "encrypt" ? "Ciphertext" : "Plaintext"}</p>
          <div className="tool-output-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "0.5rem" }}>
            <span className="tool-output-value" style={{ wordBreak: "break-all", width: "100%" }}>{output}</span>
            <CopyButton text={output} />
          </div>
        </div>
      )}
    </div>
  )
}
