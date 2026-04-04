"use client"

import { useState, useCallback } from "react"
import { CopyButton } from "./CopyButton"

// First 256 words from the official BIP39 English wordlist.
// This is a subset for demonstration; a production implementation would use the full 2048-word list.
const BIP39_WORDS = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  "action","actor","actress","actual","adapt","add","addict","address","adjust","admit",
  "adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent",
  "agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert",
  "alien","all","alley","allow","almost","alone","alpha","already","also","alter",
  "always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger",
  "angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique",
  "anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic",
  "area","arena","argue","arm","armed","armor","army","around","arrange","arrest",
  "arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset",
  "assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction",
  "audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake",
  "aware","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag",
  "balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel",
  "base","basic","basket","battle","beach","bean","beauty","because","become","beef",
  "before","begin","behave","behind","believe","below","belt","bench","benefit","best",
  "betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird",
  "birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind",
  "blood","blossom","blow","blue","blur","blush","board","boat","body","boil",
  "bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom",
  "bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze",
  "brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom",
  "brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk",
  "bullet","bundle","bunny","burden","burger","burst","bus","business","busy","butter",
  "buyer","buzz","cabbage","cabin","cable",
]

function generateMnemonic(wordCount: number): string {
  const indices = new Uint32Array(wordCount)
  crypto.getRandomValues(indices)
  return Array.from(indices, v => BIP39_WORDS[v % BIP39_WORDS.length]).join(" ")
}

const WORD_COUNTS = [12, 15, 18, 21, 24] as const

export function Bip39GeneratorTool() {
  const [wordCount, setWordCount] = useState<number>(12)
  const [mnemonic, setMnemonic] = useState("")

  const handleGenerate = useCallback(() => {
    setMnemonic(generateMnemonic(wordCount))
  }, [wordCount])

  return (
    <div>
      <div className="tool-section">
        <div className="tool-columns">
          <div className="tool-field" style={{ flex: 1 }}>
            <label>Word count</label>
            <select value={wordCount} onChange={e => setWordCount(Number(e.target.value))}>
              {WORD_COUNTS.map(n => (
                <option key={n} value={n}>{n} words</option>
              ))}
            </select>
          </div>
          <div className="tool-actions" style={{ flex: 1, display: "flex", alignItems: "flex-end" }}>
            <button onClick={handleGenerate}>Generate</button>
          </div>
        </div>
      </div>

      {mnemonic && (
        <div className="tool-section">
          <div className="tool-output-row">
            <span
              className="tool-output-value"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontFamily: "monospace" }}
            >
              {mnemonic}
            </span>
            <CopyButton text={mnemonic} />
          </div>
          <div className="tool-actions">
            <button onClick={handleGenerate}>Refresh</button>
          </div>
        </div>
      )}

      <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.75rem" }}>
        Demo only: uses a 256-word subset of the official BIP39 English wordlist. Not suitable for production key derivation.
      </p>
    </div>
  )
}
