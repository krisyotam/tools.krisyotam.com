"use client"

import { useState } from "react"
import { CopyButton } from "./CopyButton"

// Common OUI prefixes (first 3 bytes of MAC address) mapped to vendor names
const OUI_DATABASE: Record<string, string> = {
  "00:00:0C": "Cisco Systems",
  "00:01:42": "Cisco Systems",
  "00:03:93": "Apple",
  "00:05:02": "Apple",
  "00:0A:27": "Apple",
  "00:0A:95": "Apple",
  "00:0D:93": "Apple",
  "00:10:FA": "Apple",
  "00:11:24": "Apple",
  "00:14:51": "Apple",
  "00:16:CB": "Apple",
  "00:17:F2": "Apple",
  "00:19:E3": "Apple",
  "00:1B:63": "Apple",
  "00:1C:B3": "Apple",
  "00:1D:4F": "Apple",
  "00:1E:52": "Apple",
  "00:1E:C2": "Apple",
  "00:1F:5B": "Apple",
  "00:1F:F3": "Apple",
  "00:21:E9": "Apple",
  "00:22:41": "Apple",
  "00:23:12": "Apple",
  "00:23:32": "Apple",
  "00:23:6C": "Apple",
  "00:23:DF": "Apple",
  "00:24:36": "Apple",
  "00:25:00": "Apple",
  "00:25:4B": "Apple",
  "00:25:BC": "Apple",
  "00:26:08": "Apple",
  "00:26:4A": "Apple",
  "00:26:B0": "Apple",
  "00:26:BB": "Apple",
  "00:50:E4": "Apple",
  "00:50:56": "VMware",
  "00:0C:29": "VMware",
  "00:05:69": "VMware",
  "00:1C:14": "VMware",
  "00:15:5D": "Microsoft (Hyper-V)",
  "00:17:FA": "Microsoft",
  "00:50:F2": "Microsoft",
  "00:03:FF": "Microsoft",
  "28:18:78": "Microsoft",
  "00:1D:D8": "Microsoft",
  "7C:1E:52": "Microsoft",
  "00:1A:A0": "Dell",
  "00:06:5B": "Dell",
  "00:08:74": "Dell",
  "00:0B:DB": "Dell",
  "00:0D:56": "Dell",
  "00:0F:1F": "Dell",
  "00:11:43": "Dell",
  "00:12:3F": "Dell",
  "00:13:72": "Dell",
  "00:14:22": "Dell",
  "00:15:C5": "Dell",
  "00:18:8B": "Dell",
  "00:19:B9": "Dell",
  "00:1A:4B": "Dell",
  "00:1C:23": "Dell",
  "00:1E:4F": "Dell",
  "00:21:70": "Dell",
  "00:22:19": "Dell",
  "00:24:E8": "Dell",
  "00:25:64": "Dell",
  "00:26:B9": "Dell",
  "18:A9:05": "Hewlett Packard",
  "00:01:E6": "Hewlett Packard",
  "00:02:A5": "Hewlett Packard",
  "00:04:EA": "Hewlett Packard",
  "00:08:02": "Hewlett Packard",
  "00:0A:57": "Hewlett Packard",
  "00:0B:CD": "Hewlett Packard",
  "00:0D:9D": "Hewlett Packard",
  "00:0F:20": "Hewlett Packard",
  "00:10:83": "Hewlett Packard",
  "00:11:0A": "Hewlett Packard",
  "00:11:85": "Hewlett Packard",
  "00:12:79": "Hewlett Packard",
  "00:13:21": "Hewlett Packard",
  "00:14:38": "Hewlett Packard",
  "00:15:60": "Hewlett Packard",
  "00:17:08": "Hewlett Packard",
  "00:18:FE": "Hewlett Packard",
  "00:1A:4B": "Hewlett Packard",
  "00:1B:78": "Hewlett Packard",
  "00:1C:C4": "Hewlett Packard",
  "00:1E:0B": "Hewlett Packard",
  "00:21:5A": "Hewlett Packard",
  "00:22:64": "Hewlett Packard",
  "00:24:81": "Hewlett Packard",
  "00:25:B3": "Hewlett Packard",
  "3C:D9:2B": "Hewlett Packard",
  "00:1A:11": "Google",
  "3C:5A:B4": "Google",
  "54:60:09": "Google",
  "94:EB:2C": "Google",
  "F4:F5:D8": "Google",
  "F4:F5:E8": "Google",
  "A4:77:33": "Google",
  "00:1E:C0": "Microchip Technology",
  "08:00:27": "Oracle VirtualBox",
  "08:00:20": "Oracle/Sun Microsystems",
  "00:03:BA": "Oracle/Sun Microsystems",
  "00:14:4F": "Oracle/Sun Microsystems",
  "00:21:28": "Oracle/Sun Microsystems",
  "00:1B:21": "Intel",
  "00:02:B3": "Intel",
  "00:03:47": "Intel",
  "00:04:23": "Intel",
  "00:07:E9": "Intel",
  "00:0C:F1": "Intel",
  "00:0E:0C": "Intel",
  "00:0E:35": "Intel",
  "00:11:11": "Intel",
  "00:12:F0": "Intel",
  "00:13:02": "Intel",
  "00:13:20": "Intel",
  "00:13:CE": "Intel",
  "00:13:E8": "Intel",
  "00:15:00": "Intel",
  "00:15:17": "Intel",
  "00:16:6F": "Intel",
  "00:16:76": "Intel",
  "00:16:EA": "Intel",
  "00:16:EB": "Intel",
  "00:17:35": "Intel",
  "00:18:DE": "Intel",
  "00:19:D1": "Intel",
  "00:19:D2": "Intel",
  "00:1B:77": "Intel",
  "00:1C:BF": "Intel",
  "00:1D:E0": "Intel",
  "00:1E:64": "Intel",
  "00:1E:65": "Intel",
  "00:1F:3B": "Intel",
  "00:1F:3C": "Intel",
  "00:20:7B": "Intel",
  "00:21:5C": "Intel",
  "00:21:6A": "Intel",
  "00:21:6B": "Intel",
  "00:22:FA": "Intel",
  "00:22:FB": "Intel",
  "00:23:14": "Intel",
  "00:23:15": "Intel",
  "00:24:D6": "Intel",
  "00:24:D7": "Intel",
  "00:26:C6": "Intel",
  "00:26:C7": "Intel",
  "00:27:10": "Intel",
  "3C:97:0E": "Intel",
  "4C:34:88": "Intel",
  "58:94:6B": "Intel",
  "5C:51:4F": "Intel",
  "68:05:CA": "Intel",
  "78:2B:CB": "Intel",
  "7C:5C:F8": "Intel",
  "8C:70:5A": "Intel",
  "A0:88:B4": "Intel",
  "B4:B6:76": "Intel",
  "D4:BE:D9": "Intel",
  "E8:B1:FC": "Intel",
  "F8:63:3F": "Intel",
  "00:00:5E": "IANA",
  "00:09:0F": "Fortinet",
  "00:0C:E6": "Meru Networks",
  "00:17:0F": "Cisco Systems",
  "00:18:0A": "Cisco Systems",
  "00:18:73": "Cisco Systems",
  "00:18:B9": "Cisco Systems",
  "00:19:2F": "Cisco Systems",
  "00:19:30": "Cisco Systems",
  "00:19:55": "Cisco Systems",
  "00:19:A9": "Cisco Systems",
  "00:19:AA": "Cisco Systems",
  "00:1A:2F": "Cisco Systems",
  "00:1A:30": "Cisco Systems",
  "00:1A:6C": "Cisco Systems",
  "00:1A:6D": "Cisco Systems",
  "00:1A:A1": "Cisco Systems",
  "00:1A:E2": "Cisco Systems",
  "00:1B:0C": "Cisco Systems",
  "00:1B:0D": "Cisco Systems",
  "00:1B:2A": "Cisco Systems",
  "00:1B:53": "Cisco Systems",
  "00:1B:54": "Cisco Systems",
  "00:1B:67": "Cisco Systems",
  "00:1B:8F": "Cisco Systems",
  "00:1B:D4": "Cisco Systems",
  "00:1B:D5": "Cisco Systems",
  "00:1B:D7": "Cisco Systems",
  "00:1C:0E": "Cisco Systems",
  "00:1C:0F": "Cisco Systems",
  "00:1C:10": "Cisco Systems",
  "00:1C:57": "Cisco Systems",
  "00:1C:58": "Cisco Systems",
  "D0:D3:E0": "Samsung",
  "00:00:F0": "Samsung",
  "00:02:78": "Samsung",
  "00:07:AB": "Samsung",
  "00:09:18": "Samsung",
  "00:0D:AE": "Samsung",
  "00:0F:73": "Samsung",
  "00:12:47": "Samsung",
  "00:12:FB": "Samsung",
  "00:13:77": "Samsung",
  "00:15:99": "Samsung",
  "00:15:B9": "Samsung",
  "00:16:32": "Samsung",
  "00:16:6B": "Samsung",
  "00:16:6C": "Samsung",
  "00:16:DB": "Samsung",
  "00:17:C9": "Samsung",
  "00:17:D5": "Samsung",
  "00:18:AF": "Samsung",
  "00:1A:8A": "Samsung",
  "00:1B:98": "Samsung",
  "00:1C:43": "Samsung",
  "00:1D:25": "Samsung",
  "00:1D:F6": "Samsung",
  "00:1E:7D": "Samsung",
  "00:1E:E1": "Samsung",
  "00:1E:E2": "Samsung",
  "00:1F:CC": "Samsung",
  "00:1F:CD": "Samsung",
  "00:21:19": "Samsung",
  "00:21:4C": "Samsung",
  "00:21:D1": "Samsung",
  "00:21:D2": "Samsung",
  "00:23:39": "Samsung",
  "00:23:3A": "Samsung",
  "00:23:99": "Samsung",
  "00:23:C2": "Samsung",
  "00:23:D6": "Samsung",
  "00:23:D7": "Samsung",
  "00:24:54": "Samsung",
  "00:24:90": "Samsung",
  "00:24:91": "Samsung",
  "00:24:E9": "Samsung",
  "00:25:66": "Samsung",
  "00:25:67": "Samsung",
  "00:26:37": "Samsung",
  "00:26:5D": "Samsung",
  "00:26:5F": "Samsung",
  "34:C3:AC": "Samsung",
  "38:01:97": "Samsung",
  "40:0E:85": "Samsung",
  "50:01:BB": "Samsung",
  "50:B7:C3": "Samsung",
  "54:92:BE": "Samsung",
  "5C:0A:5B": "Samsung",
  "5C:3C:27": "Samsung",
  "68:27:37": "Amazon",
  "40:B4:CD": "Amazon",
  "74:C2:46": "Amazon",
  "84:D6:D0": "Amazon",
  "A0:02:DC": "Amazon",
  "AC:63:BE": "Amazon",
  "B4:7C:9C": "Amazon",
  "F0:27:2D": "Amazon",
  "FC:65:DE": "Amazon",
  "00:BB:3A": "Amazon",
  "44:65:0D": "Amazon",
  "B0:FC:0D": "Amazon",
  "00:FC:8B": "Amazon",
  "14:91:82": "Amazon",
  "34:D2:70": "Amazon",
  "FE:27:2D": "Amazon",
  "00:1A:79": "Netgear",
  "00:09:5B": "Netgear",
  "00:0F:B5": "Netgear",
  "00:14:6C": "Netgear",
  "00:18:4D": "Netgear",
  "00:1B:2F": "Netgear",
  "00:1E:2A": "Netgear",
  "00:1F:33": "Netgear",
  "00:22:3F": "Netgear",
  "00:24:B2": "Netgear",
  "00:26:F2": "Netgear",
  "20:4E:7F": "Netgear",
  "2C:B0:5D": "Netgear",
  "30:46:9A": "Netgear",
  "C4:3D:C7": "Netgear",
  "E0:46:9A": "Netgear",
  "C0:3F:0E": "Netgear",
  "00:90:4C": "Broadcom",
  "00:10:18": "Broadcom",
  "00:1C:4A": "Broadcom",
  "08:3E:8E": "Broadcom",
  "DC:A6:32": "Raspberry Pi Foundation",
  "B8:27:EB": "Raspberry Pi Foundation",
  "E4:5F:01": "Raspberry Pi Foundation",
  "2C:CF:67": "Raspberry Pi Foundation",
  "D8:3A:DD": "Raspberry Pi Foundation",
  "00:50:C2": "IEEE Registration Authority",
  "70:B3:D5": "IEEE Registration Authority",
}

function normalizeMac(mac: string): string {
  const hex = mac.replace(/[^0-9a-fA-F]/g, "")
  if (hex.length !== 12) return ""
  return hex.match(/.{2}/g)!.join(":").toUpperCase()
}

function getOui(normalizedMac: string): string {
  return normalizedMac.slice(0, 8).toUpperCase()
}

function isValidMac(mac: string): boolean {
  const hex = mac.replace(/[^0-9a-fA-F]/g, "")
  return hex.length === 12
}

function isMulticast(mac: string): boolean {
  const hex = mac.replace(/[^0-9a-fA-F]/g, "")
  return (parseInt(hex[1], 16) & 1) === 1
}

function isLocallyAdministered(mac: string): boolean {
  const hex = mac.replace(/[^0-9a-fA-F]/g, "")
  return (parseInt(hex[1], 16) & 2) === 2
}

export function MacAddressLookupTool() {
  const [input, setInput] = useState("")

  const valid = input.trim() ? isValidMac(input) : null
  const normalized = valid ? normalizeMac(input) : ""
  const oui = normalized ? getOui(normalized) : ""
  const vendor = oui ? (OUI_DATABASE[oui] || "Unknown vendor") : ""
  const multicast = valid ? isMulticast(input) : null
  const local = valid ? isLocallyAdministered(input) : null

  return (
    <div>
      <div className="tool-columns">
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">MAC Address</p>
          <div className="tool-field">
            <label>Enter MAC Address</label>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="00:1A:2B:3C:4D:5E or 001A2B3C4D5E"
              style={{ fontFamily: "monospace" }}
            />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
            Accepts formats: XX:XX:XX:XX:XX:XX, XX-XX-XX-XX-XX-XX, or XXXXXXXXXXXX
          </p>
        </div>
        <div className="tool-section" style={{ flex: 1 }}>
          <p className="tool-section-title">Results</p>
          {valid === null && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "0.5rem 0" }}>
              Enter a MAC address to look up.
            </p>
          )}
          {valid === false && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", padding: "0.5rem 0" }}>
              Invalid MAC address format. A MAC address must be 12 hexadecimal characters.
            </p>
          )}
          {valid && (
            <div>
              <div className="tool-output-row">
                <span className="tool-output-label">Normalized</span>
                <span className="tool-output-value">{normalized}</span>
                <CopyButton text={normalized} />
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">OUI Prefix</span>
                <span className="tool-output-value">{oui}</span>
                <CopyButton text={oui} />
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">Vendor</span>
                <span className="tool-output-value">{vendor}</span>
                <CopyButton text={vendor} />
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">Type</span>
                <span className="tool-output-value">{multicast ? "Multicast" : "Unicast"}</span>
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">Administration</span>
                <span className="tool-output-value">{local ? "Locally Administered" : "Universally Administered (UAA)"}</span>
              </div>
              <div className="tool-output-row">
                <span className="tool-output-label">Valid Format</span>
                <span className="tool-output-value">Yes</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
