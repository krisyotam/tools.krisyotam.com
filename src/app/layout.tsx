import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/lib/theme-context"
import { Sidebar } from "@/components/Sidebar"
import { getAllTools } from "@/lib/db"

const fontSans = localFont({
  src: [
    { path: "../../public/fonts/text/ibm-plex-sans/IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/text/ibm-plex-sans/IBMPlexSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../../public/fonts/text/ibm-plex-sans/IBMPlexSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../../public/fonts/text/ibm-plex-sans/IBMPlexSans-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-sans",
  display: "swap",
  preload: true,
})

const fontSerif = localFont({
  src: [
    { path: "../../public/fonts/text/source-serif-4/SourceSerif4-Variable.woff2", style: "normal" },
    { path: "../../public/fonts/text/source-serif-4/SourceSerif4-VariableItalic.woff2", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
  preload: true,
})

const fontMono = localFont({
  src: [
    { path: "../../public/fonts/mono/ibm-plex-mono/IBMPlexMono-Regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "Tools — Kris Yotam",
  description: "Browser utilities and developer tools.",
  icons: { icon: "/favicon.png" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tools = getAllTools().map(t => ({
    name: t.name,
    slug: t.slug,
    category: t.category,
    icon: t.icon,
  }))

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable}`}>
        <ThemeProvider>
          <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
            <Sidebar tools={tools} />
            <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
