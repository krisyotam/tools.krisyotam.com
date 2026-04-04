"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ""
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function formatPem(base64: string, label: string): string {
  const lines: string[] = []
  for (let i = 0; i < base64.length; i += 64) {
    lines.push(base64.substring(i, i + 64))
  }
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----`
}

const KEY_SIZES = [2048, 4096] as const

export function RsaKeyPairGeneratorTool() {
  const [keySize, setKeySize] = useState<number>(2048)
  const [publicKey, setPublicKey] = useState("")
  const [privateKey, setPrivateKey] = useState("")
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async () => {
    setGenerating(true)
    setError("")
    setPublicKey("")
    setPrivateKey("")
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["sign", "verify"]
      )

      const spki = await crypto.subtle.exportKey("spki", keyPair.publicKey)
      const pkcs8 = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey)

      setPublicKey(formatPem(arrayBufferToBase64(spki), "PUBLIC KEY"))
      setPrivateKey(formatPem(arrayBufferToBase64(pkcs8), "PRIVATE KEY"))
    } catch (e) {
      setError("Key generation failed. Your browser may not support this operation.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-columns">
          <div className="tool-field" style={{ flex: 1 }}>
            <label>Key size</label>
            <select value={keySize} onChange={e => setKeySize(Number(e.target.value))}>
              {KEY_SIZES.map(s => (
                <option key={s} value={s}>{s} bits</option>
              ))}
            </select>
          </div>
          <div className="tool-actions" style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <button onClick={handleGenerate} disabled={generating}>
              {generating ? "Generating..." : "Generate Key Pair"}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      {(publicKey || privateKey) && (
        <div className="tool-section">
          <div className="tool-columns">
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Public Key</label>
              <div className="tool-output-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <textarea
                  readOnly
                  value={publicKey}
                  rows={12}
                  style={{ fontFamily: "monospace", fontSize: "0.72rem", resize: "vertical" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.25rem" }}>
                  <CopyButton text={publicKey} />
                </div>
              </div>
            </div>
            <div className="tool-field" style={{ flex: 1 }}>
              <label>Private Key</label>
              <div className="tool-output-row" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <textarea
                  readOnly
                  value={privateKey}
                  rows={12}
                  style={{ fontFamily: "monospace", fontSize: "0.72rem", resize: "vertical" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.25rem" }}>
                  <CopyButton text={privateKey} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
