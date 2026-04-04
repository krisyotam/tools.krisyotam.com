"use client"

import { CopyButton } from "./CopyButton"

interface Entry {
  pattern: string
  desc: string
}

interface Section {
  title: string
  entries: Entry[]
}

const sections: Section[] = [
  {
    title: "Character Classes",
    entries: [
      { pattern: ".", desc: "Any character except newline" },
      { pattern: "\\d", desc: "Digit [0-9]" },
      { pattern: "\\D", desc: "Non-digit [^0-9]" },
      { pattern: "\\w", desc: "Word character [a-zA-Z0-9_]" },
      { pattern: "\\W", desc: "Non-word character" },
      { pattern: "\\s", desc: "Whitespace (space, tab, newline)" },
      { pattern: "\\S", desc: "Non-whitespace" },
      { pattern: "[abc]", desc: "Any of a, b, or c" },
      { pattern: "[^abc]", desc: "Not a, b, or c" },
      { pattern: "[a-z]", desc: "Character range a through z" },
      { pattern: "[a-zA-Z]", desc: "Any letter" },
      { pattern: "\\b", desc: "Word boundary" },
      { pattern: "\\B", desc: "Non-word boundary" },
    ],
  },
  {
    title: "Quantifiers",
    entries: [
      { pattern: "*", desc: "Zero or more" },
      { pattern: "+", desc: "One or more" },
      { pattern: "?", desc: "Zero or one" },
      { pattern: "{n}", desc: "Exactly n times" },
      { pattern: "{n,}", desc: "n or more times" },
      { pattern: "{n,m}", desc: "Between n and m times" },
      { pattern: "*?", desc: "Zero or more (lazy)" },
      { pattern: "+?", desc: "One or more (lazy)" },
      { pattern: "??", desc: "Zero or one (lazy)" },
    ],
  },
  {
    title: "Anchors",
    entries: [
      { pattern: "^", desc: "Start of string (or line with m flag)" },
      { pattern: "$", desc: "End of string (or line with m flag)" },
      { pattern: "\\A", desc: "Start of string (absolute)" },
      { pattern: "\\Z", desc: "End of string (absolute)" },
      { pattern: "\\b", desc: "Word boundary" },
    ],
  },
  {
    title: "Groups and References",
    entries: [
      { pattern: "(abc)", desc: "Capturing group" },
      { pattern: "(?:abc)", desc: "Non-capturing group" },
      { pattern: "(?<name>abc)", desc: "Named capturing group" },
      { pattern: "\\1", desc: "Backreference to group 1" },
      { pattern: "\\k<name>", desc: "Backreference to named group" },
      { pattern: "(a|b)", desc: "Alternation: a or b" },
    ],
  },
  {
    title: "Lookahead and Lookbehind",
    entries: [
      { pattern: "(?=abc)", desc: "Positive lookahead" },
      { pattern: "(?!abc)", desc: "Negative lookahead" },
      { pattern: "(?<=abc)", desc: "Positive lookbehind" },
      { pattern: "(?<!abc)", desc: "Negative lookbehind" },
    ],
  },
  {
    title: "Flags",
    entries: [
      { pattern: "g", desc: "Global: match all occurrences" },
      { pattern: "i", desc: "Case-insensitive matching" },
      { pattern: "m", desc: "Multiline: ^ and $ match line boundaries" },
      { pattern: "s", desc: "Dotall: . matches newline" },
      { pattern: "u", desc: "Unicode: full Unicode support" },
      { pattern: "y", desc: "Sticky: match at lastIndex position" },
      { pattern: "d", desc: "Indices: capture start/end positions" },
    ],
  },
  {
    title: "Common Patterns",
    entries: [
      { pattern: "^\\S+@\\S+\\.\\S+$", desc: "Simple email" },
      { pattern: "^https?://", desc: "URL starting with http(s)" },
      { pattern: "^\\d{1,3}(\\.\\d{1,3}){3}$", desc: "IPv4 address" },
      { pattern: "^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$", desc: "Hex color" },
      { pattern: "^\\d{4}-\\d{2}-\\d{2}$", desc: "Date YYYY-MM-DD" },
      { pattern: "^-?\\d+(\\.\\d+)?$", desc: "Number (int or float)" },
    ],
  },
]

export function RegexMemoTool() {
  return (
    <div>
      {sections.map(section => (
        <div className="tool-section" key={section.title}>
          <p className="tool-section-title">{section.title}</p>
          {section.entries.map(entry => (
            <div className="tool-output-row" key={entry.pattern}>
              <span className="tool-output-label" style={{ fontFamily: "monospace", fontSize: "0.8rem", minWidth: "200px" }}>{entry.pattern}</span>
              <span className="tool-output-value" style={{ fontSize: "0.82rem" }}>{entry.desc}</span>
              <CopyButton text={entry.pattern} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
