import { getAllTools, getToolBySlug } from "@/lib/db"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { toolPages } from "@/lib/tool-registry"

export function generateStaticParams() {
  return getAllTools().map(t => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return { title: "Not Found" }
  return {
    title: `${tool.name} — Tools`,
    description: tool.description,
  }
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) notFound()

  const MDXContent = toolPages[slug]

  return (
    <div className="tool-scroll">
      <div className="tool-page">
        <div className="tool-page-header">
          <h1 className="tool-page-title">{tool.name}</h1>
          <p className="tool-page-desc">{tool.description}</p>
        </div>
        <div className="tool-page-body">
          {MDXContent ? <MDXContent /> : (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>This tool is coming soon.</p>
          )}
        </div>
      </div>
    </div>
  )
}
