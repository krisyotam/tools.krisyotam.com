"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

interface ComposeService {
  image: string
  container_name?: string
  ports?: string[]
  volumes?: string[]
  environment?: string[]
  restart?: string
}

function parseDockerRun(cmd: string): ComposeService | null {
  // Normalize: join continuation lines, collapse whitespace
  const normalized = cmd.replace(/\\\n/g, " ").replace(/\s+/g, " ").trim()

  // Must start with docker run
  if (!/^docker\s+run\b/i.test(normalized)) return null

  const service: ComposeService = { image: "" }
  const ports: string[] = []
  const volumes: string[] = []
  const envVars: string[] = []

  // Tokenize respecting quotes
  const tokens: string[] = []
  let current = ""
  let inQuote = ""
  for (const ch of normalized) {
    if (inQuote) {
      if (ch === inQuote) {
        inQuote = ""
      } else {
        current += ch
      }
    } else if (ch === '"' || ch === "'") {
      inQuote = ch
    } else if (ch === " ") {
      if (current) tokens.push(current)
      current = ""
    } else {
      current += ch
    }
  }
  if (current) tokens.push(current)

  // Skip "docker" and "run"
  let i = 0
  while (i < tokens.length && tokens[i] !== "run") i++
  i++ // skip "run"

  while (i < tokens.length) {
    const tok = tokens[i]

    if (tok === "-p" || tok === "--publish") {
      i++
      if (i < tokens.length) ports.push(tokens[i])
    } else if (tok.startsWith("-p=") || tok.startsWith("--publish=")) {
      ports.push(tok.split("=", 2)[1])
    } else if (tok === "-v" || tok === "--volume") {
      i++
      if (i < tokens.length) volumes.push(tokens[i])
    } else if (tok.startsWith("-v=") || tok.startsWith("--volume=")) {
      volumes.push(tok.split("=", 2)[1])
    } else if (tok === "-e" || tok === "--env") {
      i++
      if (i < tokens.length) envVars.push(tokens[i])
    } else if (tok.startsWith("-e=") || tok.startsWith("--env=")) {
      envVars.push(tok.split("=", 2)[1])
    } else if (tok === "--name") {
      i++
      if (i < tokens.length) service.container_name = tokens[i]
    } else if (tok.startsWith("--name=")) {
      service.container_name = tok.split("=", 2)[1]
    } else if (tok === "--restart") {
      i++
      if (i < tokens.length) service.restart = tokens[i]
    } else if (tok.startsWith("--restart=")) {
      service.restart = tok.split("=", 2)[1]
    } else if (tok === "-d" || tok === "--detach") {
      // detach flag, no equivalent in compose (services run detached by default)
    } else if (tok === "--rm" || tok === "-it" || tok === "-i" || tok === "-t") {
      // skip runtime-only flags
    } else if (tok.startsWith("-")) {
      // unknown flag, skip its value if it looks like a key-value pair
      if (!tok.includes("=") && i + 1 < tokens.length && !tokens[i + 1].startsWith("-")) {
        i++
      }
    } else {
      // Positional arg = image (possibly with command after)
      if (!service.image) {
        service.image = tok
      }
      // Remaining tokens after image would be the command, skip for now
    }
    i++
  }

  if (!service.image) return null

  if (ports.length) service.ports = ports
  if (volumes.length) service.volumes = volumes
  if (envVars.length) service.environment = envVars

  return service
}

function toComposeYaml(svc: ComposeService): string {
  const name = svc.container_name || svc.image.split("/").pop()?.split(":")[0] || "app"
  const lines: string[] = []

  lines.push("services:")
  lines.push(`  ${name}:`)
  lines.push(`    image: ${svc.image}`)
  if (svc.container_name) lines.push(`    container_name: ${svc.container_name}`)
  if (svc.restart) lines.push(`    restart: ${svc.restart}`)
  if (svc.ports && svc.ports.length) {
    lines.push("    ports:")
    for (const p of svc.ports) lines.push(`      - "${p}"`)
  }
  if (svc.volumes && svc.volumes.length) {
    lines.push("    volumes:")
    for (const v of svc.volumes) lines.push(`      - ${v}`)
  }
  if (svc.environment && svc.environment.length) {
    lines.push("    environment:")
    for (const e of svc.environment) lines.push(`      - ${e}`)
  }

  return lines.join("\n")
}

export function DockerRunToComposeTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")

  const convert = () => {
    setError("")
    setOutput("")
    const svc = parseDockerRun(input)
    if (!svc) {
      setError("Could not parse docker run command. Make sure it starts with 'docker run'.")
      return
    }
    setOutput(toComposeYaml(svc))
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>docker run command</label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={6}
            placeholder={'docker run -d \\\n  --name myapp \\\n  -p 8080:80 \\\n  -v ./data:/data \\\n  -e DB_HOST=localhost \\\n  --restart unless-stopped \\\n  nginx:latest'}
            style={{ fontFamily: "monospace", fontSize: "0.82rem" }}
          />
        </div>
        <div className="tool-actions">
          <button onClick={convert}>Convert</button>
        </div>
      </div>

      {error && (
        <p style={{ fontSize: "0.78rem", color: "hsl(0 70% 55%)", marginTop: "0.5rem" }}>{error}</p>
      )}

      {output && (
        <div className="tool-section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <p className="tool-section-title" style={{ margin: 0 }}>docker-compose.yml</p>
            <CopyButton text={output} />
          </div>
          <pre style={{
            padding: "0.75rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: 0,
            fontSize: "0.76rem",
            overflow: "auto",
            maxHeight: 400,
            margin: 0,
            fontFamily: "monospace",
          }}>
            <code>{output}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
