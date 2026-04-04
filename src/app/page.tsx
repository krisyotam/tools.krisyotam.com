import { getAllTools } from "@/lib/db"
import { HomeSearch } from "@/components/HomeSearch"

export default function HomePage() {
  const tools = getAllTools().map(t => ({
    name: t.name,
    slug: t.slug,
    description: t.description,
    category: t.category,
  }))

  return <HomeSearch tools={tools} />
}
