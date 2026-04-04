#!/usr/bin/env node
const Database = require("better-sqlite3")
const path = require("path")
const fs = require("fs")

const DB_PATH = path.join(__dirname, "..", "public", "data", "tools.db")

// Ensure directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true })

// Remove existing DB
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH)

const db = new Database(DB_PATH)
db.pragma("journal_mode = WAL")

db.exec(`
  CREATE TABLE tools (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT 'FileText'
  )
`)

const insert = db.prepare("INSERT INTO tools (name, slug, description, category, icon) VALUES (?, ?, ?, ?, ?)")

const tools = [
  // Crypto
  ["Token Generator", "token-generator", "Generate random strings with custom character sets, lengths, and formats.", "Crypto", "Shuffle"],
  ["Hash Text", "hash-text", "Hash a text string using MD5, SHA1, SHA256, SHA384, SHA512, SHA3, or RIPEMD160.", "Crypto", "Hash"],
  ["Bcrypt", "bcrypt", "Hash and compare text using bcrypt, a password-hashing function based on the Blowfish cipher.", "Crypto", "Lock"],
  ["UUID Generator", "uuid-generator", "Generate universally unique identifiers (v1, v4, v7) for use in databases and systems.", "Crypto", "Fingerprint"],
  ["ULID Generator", "ulid-generator", "Generate universally unique lexicographically sortable identifiers.", "Crypto", "ArrowUpDown"],
  ["Encrypt / Decrypt Text", "encryption", "Encrypt and decrypt text using AES, TripleDES, Rabbit, or RC4.", "Crypto", "ShieldCheck"],
  ["BIP39 Passphrase Generator", "bip39-generator", "Generate a BIP39 mnemonic passphrase for cryptographic key derivation.", "Crypto", "Key"],
  ["HMAC Generator", "hmac-generator", "Compute a hash-based message authentication code using a secret key.", "Crypto", "KeyRound"],
  ["RSA Key Pair Generator", "rsa-key-pair-generator", "Generate random RSA private and public PEM certificate key pairs.", "Crypto", "FileLock2"],
  ["Password Strength Analyser", "password-strength-analyser", "Analyse password strength with crack time estimation, entirely client-side.", "Crypto", "ShieldAlert"],
  ["PDF Signature Checker", "pdf-signature-checker", "Verify PDF file signatures to check if contents have been altered.", "Crypto", "FileCheck"],

  // Converter
  ["Date-Time Converter", "date-time-converter", "Convert date and time between various formats (Unix, ISO 8601, RFC 2822, etc.).", "Converter", "Clock"],
  ["Integer Base Converter", "integer-base-converter", "Convert numbers between decimal, hexadecimal, binary, octal, and base64.", "Converter", "Binary"],
  ["Roman Numeral Converter", "roman-numeral-converter", "Convert between Roman numerals and Arabic numbers.", "Converter", "Columns2"],
  ["Base64 String Encoder/Decoder", "base64-string-converter", "Encode and decode strings to and from base64 representation.", "Converter", "Code"],
  ["Base64 File Converter", "base64-file-converter", "Convert files to and from base64 encoded strings.", "Converter", "FileCode"],
  ["Color Converter", "color-converter", "Convert colors between hex, RGB, HSL, and CSS named formats.", "Converter", "Palette"],
  ["Case Converter", "case-converter", "Transform text between camelCase, snake_case, kebab-case, PascalCase, and more.", "Converter", "CaseSensitive"],
  ["Text to NATO Alphabet", "text-to-nato-alphabet", "Convert text to the NATO phonetic alphabet for clear oral transmission.", "Converter", "Radio"],
  ["Text to ASCII Binary", "text-to-binary", "Convert text to its ASCII binary representation and back.", "Converter", "ToggleLeft"],
  ["Text to Unicode", "text-to-unicode", "Convert text to Unicode code points and back.", "Converter", "Languages"],
  ["YAML to JSON", "yaml-to-json-converter", "Convert YAML to JSON format.", "Converter", "FileJson"],
  ["YAML to TOML", "yaml-to-toml", "Convert YAML to TOML format.", "Converter", "FileText"],
  ["JSON to YAML", "json-to-yaml-converter", "Convert JSON to YAML format.", "Converter", "FileJson"],
  ["JSON to TOML", "json-to-toml", "Convert JSON to TOML format.", "Converter", "FileText"],
  ["List Converter", "list-converter", "Process column-based data: transpose, add prefix/suffix, sort, reverse, and more.", "Converter", "List"],
  ["TOML to JSON", "toml-to-json", "Convert TOML to JSON format.", "Converter", "FileJson"],
  ["TOML to YAML", "toml-to-yaml", "Convert TOML to YAML format.", "Converter", "FileText"],
  ["XML to JSON", "xml-to-json", "Convert XML documents to JSON format.", "Converter", "FileCode"],
  ["JSON to XML", "json-to-xml", "Convert JSON to XML format.", "Converter", "FileCode"],
  ["Markdown to HTML", "markdown-to-html", "Convert Markdown to HTML with live preview.", "Converter", "FileType"],

  // Web
  ["URL Encoder/Decoder", "url-encoder", "Encode and decode URL-formatted (percent-encoded) strings.", "Web", "Link"],
  ["HTML Entity Escape", "html-entities", "Escape or unescape HTML entities for safe rendering.", "Web", "Code"],
  ["URL Parser", "url-parser", "Parse a URL into its constituent parts: protocol, host, path, params, etc.", "Web", "Unlink"],
  ["Device Information", "device-information", "Get your current device info: screen size, pixel ratio, user agent, etc.", "Web", "Monitor"],
  ["Basic Auth Generator", "basic-auth-generator", "Generate a base64-encoded Basic Authentication header.", "Web", "UserCheck"],
  ["Open Graph Meta Generator", "meta-tag-generator", "Generate Open Graph and social media HTML meta tags.", "Web", "Globe"],
  ["OTP Code Generator", "otp-code-generator-and-validator", "Generate and validate time-based one-time passwords for 2FA.", "Web", "Timer"],
  ["MIME Types", "mime-types", "Look up MIME types by file extension and vice versa.", "Web", "File"],
  ["JWT Parser", "jwt-parser", "Decode and inspect JSON Web Token claims and headers.", "Web", "Scan"],
  ["Keycode Info", "keycode-info", "Find the JavaScript keycode, code, location, and modifiers of any key press.", "Web", "Keyboard"],
  ["Slugify String", "slugify-string", "Convert text to a URL-safe, filename-safe slug.", "Web", "Tag"],
  ["HTML WYSIWYG Editor", "html-wysiwyg-editor", "Rich text editor that generates HTML source code in real time.", "Web", "PenTool"],
  ["User-Agent Parser", "user-agent-parser", "Parse user-agent strings to detect browser, OS, engine, and device.", "Web", "Search"],
  ["HTTP Status Codes", "http-status-codes", "Reference list of all HTTP status codes with names and descriptions.", "Web", "Server"],
  ["JSON Diff", "json-diff", "Compare two JSON objects and see the differences between them.", "Web", "GitCompare"],
  ["Safelink Decoder", "safelink-decoder", "Decode Outlook SafeLink URLs to reveal the original destination.", "Web", "LinkIcon"],

  // Images & Videos
  ["QR Code Generator", "qr-code-generator", "Generate and download QR codes from text or URLs.", "Images & Videos", "QrCode"],
  ["WiFi QR Code Generator", "wifi-qr-code-generator", "Generate QR codes for quick WiFi network connections.", "Images & Videos", "Wifi"],
  ["SVG Placeholder Generator", "svg-placeholder-generator", "Generate SVG placeholder images with custom dimensions and colors.", "Images & Videos", "Image"],
  ["Camera Recorder", "camera-recorder", "Capture photos or record video from your webcam.", "Images & Videos", "Camera"],

  // Development
  ["Git Cheatsheet", "git-memo", "Quick reference for the most common git commands.", "Development", "GitBranch"],
  ["Random Port Generator", "random-port-generator", "Generate random port numbers outside the well-known range (0-1023).", "Development", "Network"],
  ["Crontab Generator", "crontab-generator", "Build and validate cron expressions with human-readable descriptions.", "Development", "CalendarClock"],
  ["JSON Prettify", "json-prettify", "Format and prettify JSON strings for readability.", "Development", "Braces"],
  ["JSON Minify", "json-minify", "Compress JSON by removing all unnecessary whitespace.", "Development", "Minimize2"],
  ["JSON to CSV", "json-to-csv", "Convert JSON arrays to CSV with automatic header detection.", "Development", "Table"],
  ["SQL Prettify", "sql-prettify", "Format and prettify SQL queries for readability.", "Development", "Database"],
  ["Chmod Calculator", "chmod-calculator", "Calculate Unix file permissions and generate chmod commands.", "Development", "Shield"],
  ["Docker Run to Compose", "docker-run-to-docker-compose-converter", "Convert docker run commands to docker-compose YAML files.", "Development", "Container"],
  ["XML Formatter", "xml-formatter", "Prettify and format XML documents.", "Development", "FileCode"],
  ["YAML Prettify", "yaml-prettify", "Format and prettify YAML strings.", "Development", "FileText"],
  ["Email Normalizer", "email-normalizer", "Normalize email addresses for deduplication and comparison.", "Development", "Mail"],
  ["Regex Tester", "regex-tester", "Test regular expressions against sample text with match highlighting.", "Development", "Regex"],
  ["Regex Cheatsheet", "regex-memo", "Quick reference for JavaScript regular expression syntax.", "Development", "BookOpen"],

  // Network
  ["IPv4 Subnet Calculator", "ipv4-subnet-calculator", "Calculate IPv4 subnet details from CIDR notation.", "Network", "Network"],
  ["IPv4 Address Converter", "ipv4-address-converter", "Convert IPv4 addresses between decimal, binary, hex, and IPv6 formats.", "Network", "ArrowLeftRight"],
  ["IPv4 Range Expander", "ipv4-range-expander", "Calculate valid IPv4 subnets from start and end addresses.", "Network", "Expand"],
  ["MAC Address Lookup", "mac-address-lookup", "Find the vendor of a network device by its MAC address.", "Network", "Search"],
  ["MAC Address Generator", "mac-address-generator", "Generate random MAC addresses with custom prefix and formatting.", "Network", "Cpu"],
  ["IPv6 ULA Generator", "ipv6-ula-generator", "Generate local non-routable IPv6 addresses per RFC 4193.", "Network", "Globe"],

  // Math
  ["Math Evaluator", "math-evaluator", "Evaluate mathematical expressions with support for functions like sqrt, cos, sin.", "Math", "Calculator"],
  ["ETA Calculator", "eta-calculator", "Estimate end time and remaining duration for tasks like file downloads.", "Math", "Hourglass"],
  ["Percentage Calculator", "percentage-calculator", "Calculate percentages, percentage changes, and value-from-percentage.", "Math", "Percent"],

  // Measurement
  ["Chronometer", "chronometer", "Simple stopwatch with start, stop, lap, and reset controls.", "Measurement", "Timer"],
  ["Temperature Converter", "temperature-converter", "Convert between Celsius, Fahrenheit, Kelvin, Rankine, and more.", "Measurement", "Thermometer"],
  ["Benchmark Builder", "benchmark-builder", "Compare execution times of JavaScript code snippets.", "Measurement", "Gauge"],

  // Text
  ["Lorem Ipsum Generator", "lorem-ipsum-generator", "Generate placeholder text in paragraphs, sentences, or words.", "Text", "AlignLeft"],
  ["Text Statistics", "text-statistics", "Count characters, words, sentences, paragraphs, and estimate reading time.", "Text", "BarChart3"],
  ["Emoji Picker", "emoji-picker", "Browse and copy emojis with Unicode code point information.", "Text", "Smile"],
  ["String Obfuscator", "string-obfuscator", "Partially mask strings (secrets, IBANs, tokens) for safe sharing.", "Text", "EyeOff"],
  ["Text Diff", "text-diff", "Compare two texts side by side and highlight differences.", "Text", "GitCompare"],
  ["Numeronym Generator", "numeronym-generator", "Generate numeronyms like i18n from internationalization.", "Text", "Hash"],
  ["ASCII Art Text", "ascii-text-drawer", "Generate ASCII art text in various fonts and styles.", "Text", "Type"],

  // Data
  ["Phone Parser", "phone-parser-and-formatter", "Parse, validate, and format international phone numbers.", "Data", "Phone"],
  ["IBAN Validator", "iban-validator-and-parser", "Validate and parse IBAN numbers with country and format details.", "Data", "CreditCard"],
]

const insertMany = db.transaction(() => {
  for (const [name, slug, desc, cat, icon] of tools) {
    insert.run(name, slug, desc, cat, icon)
  }
})

insertMany()

console.log(`[seed] Inserted ${tools.length} tools into ${DB_PATH}`)
db.close()
