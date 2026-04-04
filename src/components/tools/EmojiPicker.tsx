"use client"

import { useState, useMemo } from "react"

const CATEGORIES: Record<string, string[]> = {
  "Smileys": ["\u{1F600}", "\u{1F603}", "\u{1F604}", "\u{1F601}", "\u{1F605}", "\u{1F602}", "\u{1F923}", "\u{1F60A}", "\u{1F607}", "\u{1F642}", "\u{1F643}", "\u{1F609}", "\u{1F60C}", "\u{1F60D}", "\u{1F970}", "\u{1F618}", "\u{1F617}", "\u{1F619}", "\u{1F61A}", "\u{1F60B}", "\u{1F61C}", "\u{1F61D}", "\u{1F61B}", "\u{1F911}", "\u{1F917}", "\u{1F914}", "\u{1F910}", "\u{1F928}", "\u{1F610}", "\u{1F611}", "\u{1F636}", "\u{1F60F}", "\u{1F612}", "\u{1F644}", "\u{1F62C}", "\u{1F925}", "\u{1F60E}", "\u{1F913}", "\u{1F9D0}"],
  "Gestures": ["\u{1F44D}", "\u{1F44E}", "\u{1F44F}", "\u{1F64C}", "\u{1F91D}", "\u{1F64F}", "\u270D\uFE0F", "\u{1F485}", "\u{1F933}", "\u{1F4AA}", "\u{1F9B5}", "\u{1F9B6}", "\u{1F442}", "\u{1F443}", "\u{1F9E0}", "\u{1F9B7}", "\u{1F9B4}", "\u{1F440}", "\u{1F445}", "\u{1F444}", "\u{1F44B}", "\u{1F91A}", "\u270B", "\u{1F596}", "\u{1F44C}", "\u270C\uFE0F", "\u{1F91E}", "\u{1F91F}", "\u{1F918}", "\u{1F448}", "\u{1F449}", "\u{1F446}", "\u{1F447}", "\u261D\uFE0F", "\u270A", "\u{1F44A}", "\u{1F91B}", "\u{1F91C}"],
  "Hearts": ["\u2764\uFE0F", "\u{1F9E1}", "\u{1F49B}", "\u{1F49A}", "\u{1F499}", "\u{1F49C}", "\u{1F5A4}", "\u{1F90D}", "\u{1F90E}", "\u{1F494}", "\u2763\uFE0F", "\u{1F495}", "\u{1F49E}", "\u{1F493}", "\u{1F497}", "\u{1F496}", "\u{1F498}", "\u{1F49D}", "\u{1F49F}", "\u2665\uFE0F"],
  "Animals": ["\u{1F436}", "\u{1F431}", "\u{1F42D}", "\u{1F439}", "\u{1F430}", "\u{1F98A}", "\u{1F43B}", "\u{1F43C}", "\u{1F428}", "\u{1F42F}", "\u{1F981}", "\u{1F42E}", "\u{1F437}", "\u{1F438}", "\u{1F435}", "\u{1F412}", "\u{1F414}", "\u{1F427}", "\u{1F426}", "\u{1F985}", "\u{1F989}", "\u{1F987}", "\u{1F43A}", "\u{1F417}", "\u{1F434}", "\u{1F984}", "\u{1F41D}", "\u{1F41B}", "\u{1F98B}", "\u{1F40C}", "\u{1F41A}", "\u{1F41E}", "\u{1F41C}", "\u{1F997}", "\u{1F577}\uFE0F", "\u{1F982}", "\u{1F422}", "\u{1F40D}"],
  "Food": ["\u{1F34E}", "\u{1F34F}", "\u{1F350}", "\u{1F34A}", "\u{1F34B}", "\u{1F34C}", "\u{1F349}", "\u{1F347}", "\u{1F353}", "\u{1F348}", "\u{1F352}", "\u{1F351}", "\u{1F96D}", "\u{1F34D}", "\u{1F965}", "\u{1F95D}", "\u{1F345}", "\u{1F346}", "\u{1F951}", "\u{1F966}", "\u{1F955}", "\u{1F33D}", "\u{1F336}\uFE0F", "\u{1F952}", "\u{1F96C}", "\u{1F354}", "\u{1F355}", "\u{1F32E}", "\u{1F32F}", "\u{1F37F}", "\u{1F370}", "\u{1F382}", "\u{1F36A}", "\u{1F369}", "\u{1F36B}", "\u{1F36C}", "\u{1F36D}", "\u2615"],
  "Travel": ["\u{1F697}", "\u{1F695}", "\u{1F68C}", "\u{1F693}", "\u{1F691}", "\u{1F692}", "\u{1F6F8}", "\u2708\uFE0F", "\u{1F680}", "\u{1F6F6}", "\u{1F6B2}", "\u{1F3E0}", "\u{1F3D7}\uFE0F", "\u{1F3D4}\uFE0F", "\u{1F3DD}\uFE0F", "\u{1F3D6}\uFE0F", "\u{1F30D}", "\u{1F30E}", "\u{1F30F}", "\u{1F5FA}\uFE0F"],
  "Objects": ["\u{1F4BB}", "\u{1F5A5}\uFE0F", "\u{1F4F1}", "\u{1F4F7}", "\u{1F4F9}", "\u{1F4FA}", "\u{1F4FB}", "\u23F0", "\u{1F4A1}", "\u{1F50B}", "\u{1F50C}", "\u{1F4E6}", "\u{1F4B0}", "\u{1F4B3}", "\u{1F4CE}", "\u{1F4CB}", "\u{1F4DA}", "\u{1F4D6}", "\u{1F58A}\uFE0F", "\u{1F4DD}", "\u{1F512}", "\u{1F513}", "\u{1F511}", "\u{1F527}", "\u{1F528}", "\u{1F6E0}\uFE0F", "\u2699\uFE0F", "\u{1F9F2}", "\u{1F52C}", "\u{1F52D}"],
  "Symbols": ["\u2705", "\u274C", "\u2753", "\u2757", "\u{1F4AF}", "\u{1F51E}", "\u267B\uFE0F", "\u269B\uFE0F", "\u{1F3C1}", "\u{1F6A9}", "\u2B50", "\u{1F31F}", "\u{1F525}", "\u26A1", "\u{1F4A5}", "\u2728", "\u{1F389}", "\u{1F388}", "\u{1F3B5}", "\u{1F3B6}"],
}

export function EmojiPickerTool() {
  const [search, setSearch] = useState("")
  const [copied, setCopied] = useState("")

  const filtered = useMemo(() => {
    if (!search) return CATEGORIES
    const q = search.toLowerCase()
    const result: Record<string, string[]> = {}
    for (const [cat, emojis] of Object.entries(CATEGORIES)) {
      if (cat.toLowerCase().includes(q)) {
        result[cat] = emojis
      }
    }
    return Object.keys(result).length > 0 ? result : CATEGORIES
  }, [search])

  const copy = async (emoji: string) => {
    await navigator.clipboard.writeText(emoji)
    setCopied(emoji)
    setTimeout(() => setCopied(""), 1000)
  }

  return (
    <div>
      <div className="tool-section">
        <div className="tool-field">
          <label>Search Category</label>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter by category name..." />
        </div>
        {copied && (
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Copied {copied}</p>
        )}
      </div>

      {Object.entries(filtered).map(([cat, emojis]) => (
        <div className="tool-section" key={cat}>
          <p className="tool-section-title">{cat}</p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
            gap: "2px",
          }}>
            {emojis.map((emoji, i) => (
              <button
                key={i}
                onClick={() => copy(emoji)}
                style={{
                  fontSize: "1.3rem",
                  padding: "4px",
                  border: "1px solid var(--border-color)",
                  borderRadius: 0,
                  background: copied === emoji ? "var(--bg-tertiary)" : "var(--bg-primary)",
                  cursor: "pointer",
                  lineHeight: 1,
                }}
                title="Click to copy"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
