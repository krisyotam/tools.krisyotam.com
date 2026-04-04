import type { ComponentType } from "react"
import dynamic from "next/dynamic"

// Registry of implemented tool pages.
// Each key is the tool slug matching tools.db.
// MDX files live in src/content/tools/<slug>.mdx
export const toolPages: Record<string, ComponentType> = {
  // Crypto
  "hash-text": dynamic(() => import("@/content/tools/hash-text.mdx")),
  "token-generator": dynamic(() => import("@/content/tools/token-generator.mdx")),
  "bcrypt": dynamic(() => import("@/content/tools/bcrypt.mdx")),
  "uuid-generator": dynamic(() => import("@/content/tools/uuid-generator.mdx")),

  // Converter
  "base64-string-converter": dynamic(() => import("@/content/tools/base64-string-converter.mdx")),
  "color-converter": dynamic(() => import("@/content/tools/color-converter.mdx")),
  "case-converter": dynamic(() => import("@/content/tools/case-converter.mdx")),
  "date-time-converter": dynamic(() => import("@/content/tools/date-time-converter.mdx")),
  "integer-base-converter": dynamic(() => import("@/content/tools/integer-base-converter.mdx")),
  "roman-numeral-converter": dynamic(() => import("@/content/tools/roman-numeral-converter.mdx")),
  "text-to-binary": dynamic(() => import("@/content/tools/text-to-binary.mdx")),
  "text-to-unicode": dynamic(() => import("@/content/tools/text-to-unicode.mdx")),
  "yaml-to-json-converter": dynamic(() => import("@/content/tools/yaml-to-json-converter.mdx")),
  "json-to-yaml-converter": dynamic(() => import("@/content/tools/json-to-yaml-converter.mdx")),
  "markdown-to-html": dynamic(() => import("@/content/tools/markdown-to-html.mdx")),
  "list-converter": dynamic(() => import("@/content/tools/list-converter.mdx")),
  "text-to-nato-alphabet": dynamic(() => import("@/content/tools/text-to-nato-alphabet.mdx")),

  // Web
  "url-encoder": dynamic(() => import("@/content/tools/url-encoder.mdx")),

  // Development
  "json-prettify": dynamic(() => import("@/content/tools/json-prettify.mdx")),

  // Text
  "lorem-ipsum-generator": dynamic(() => import("@/content/tools/lorem-ipsum-generator.mdx")),
  "text-statistics": dynamic(() => import("@/content/tools/text-statistics.mdx")),
  "slugify-string": dynamic(() => import("@/content/tools/slugify-string.mdx")),

  // Web
  "html-entities": dynamic(() => import("@/content/tools/html-entities.mdx")),
  "url-parser": dynamic(() => import("@/content/tools/url-parser.mdx")),
  "http-status-codes": dynamic(() => import("@/content/tools/http-status-codes.mdx")),

  // Crypto
  "basic-auth-generator": dynamic(() => import("@/content/tools/basic-auth-generator.mdx")),
  "jwt-parser": dynamic(() => import("@/content/tools/jwt-parser.mdx")),
  "ulid-generator": dynamic(() => import("@/content/tools/ulid-generator.mdx")),
  "hmac-generator": dynamic(() => import("@/content/tools/hmac-generator.mdx")),
  "encryption": dynamic(() => import("@/content/tools/encryption.mdx")),
  "password-strength-analyser": dynamic(() => import("@/content/tools/password-strength-analyser.mdx")),

  // System
  "device-information": dynamic(() => import("@/content/tools/device-information.mdx")),
  "keycode-info": dynamic(() => import("@/content/tools/keycode-info.mdx")),

  // Development (new)
  "random-port-generator": dynamic(() => import("@/content/tools/random-port-generator.mdx")),
  "crontab-generator": dynamic(() => import("@/content/tools/crontab-generator.mdx")),
  "json-minify": dynamic(() => import("@/content/tools/json-minify.mdx")),
  "json-to-csv": dynamic(() => import("@/content/tools/json-to-csv.mdx")),
  "chmod-calculator": dynamic(() => import("@/content/tools/chmod-calculator.mdx")),
  "regex-tester": dynamic(() => import("@/content/tools/regex-tester.mdx")),
  "email-normalizer": dynamic(() => import("@/content/tools/email-normalizer.mdx")),

  // Network
  "ipv4-subnet-calculator": dynamic(() => import("@/content/tools/ipv4-subnet-calculator.mdx")),
  "ipv4-address-converter": dynamic(() => import("@/content/tools/ipv4-address-converter.mdx")),
  "mac-address-generator": dynamic(() => import("@/content/tools/mac-address-generator.mdx")),

  // Math
  "math-evaluator": dynamic(() => import("@/content/tools/math-evaluator.mdx")),
  "percentage-calculator": dynamic(() => import("@/content/tools/percentage-calculator.mdx")),

  // Measurement
  "chronometer": dynamic(() => import("@/content/tools/chronometer.mdx")),
  "temperature-converter": dynamic(() => import("@/content/tools/temperature-converter.mdx")),

  // Text (new)
  "string-obfuscator": dynamic(() => import("@/content/tools/string-obfuscator.mdx")),
  "text-diff": dynamic(() => import("@/content/tools/text-diff.mdx")),
  "numeronym-generator": dynamic(() => import("@/content/tools/numeronym-generator.mdx")),
  "emoji-picker": dynamic(() => import("@/content/tools/emoji-picker.mdx")),

  // Data
  "phone-parser-and-formatter": dynamic(() => import("@/content/tools/phone-parser-and-formatter.mdx")),
  "iban-validator-and-parser": dynamic(() => import("@/content/tools/iban-validator-and-parser.mdx")),

  // Images
  "svg-placeholder-generator": dynamic(() => import("@/content/tools/svg-placeholder-generator.mdx")),
  "qr-code-generator": dynamic(() => import("@/content/tools/qr-code-generator.mdx")),
  "jpeg-to-jpg": dynamic(() => import("@/content/tools/jpeg-to-jpg.mdx")),
  "png-to-jpg": dynamic(() => import("@/content/tools/png-to-jpg.mdx")),
  "jpg-to-png": dynamic(() => import("@/content/tools/jpg-to-png.mdx")),
  "webp-to-jpg": dynamic(() => import("@/content/tools/webp-to-jpg.mdx")),
  "webp-to-png": dynamic(() => import("@/content/tools/webp-to-png.mdx")),
  "png-to-webp": dynamic(() => import("@/content/tools/png-to-webp.mdx")),
  "image-crop": dynamic(() => import("@/content/tools/image-crop.mdx")),

  // Reference
  "git-memo": dynamic(() => import("@/content/tools/git-memo.mdx")),
  "regex-memo": dynamic(() => import("@/content/tools/regex-memo.mdx")),
  "mime-types": dynamic(() => import("@/content/tools/mime-types.mdx")),

  // Parsing
  "user-agent-parser": dynamic(() => import("@/content/tools/user-agent-parser.mdx")),
  "safelink-decoder": dynamic(() => import("@/content/tools/safelink-decoder.mdx")),

  // Diff
  "json-diff": dynamic(() => import("@/content/tools/json-diff.mdx")),

  // Docker
  "docker-run-to-docker-compose-converter": dynamic(() => import("@/content/tools/docker-run-to-docker-compose-converter.mdx")),

  // Formatters
  "xml-formatter": dynamic(() => import("@/content/tools/xml-formatter.mdx")),
  "yaml-prettify": dynamic(() => import("@/content/tools/yaml-prettify.mdx")),

  // Calculators
  "eta-calculator": dynamic(() => import("@/content/tools/eta-calculator.mdx")),

  // Performance
  "benchmark-builder": dynamic(() => import("@/content/tools/benchmark-builder.mdx")),

  // Text Art
  "ascii-text-drawer": dynamic(() => import("@/content/tools/ascii-text-drawer.mdx")),

  // Networking
  "ipv4-range-expander": dynamic(() => import("@/content/tools/ipv4-range-expander.mdx")),
  "ipv6-ula-generator": dynamic(() => import("@/content/tools/ipv6-ula-generator.mdx")),
}
