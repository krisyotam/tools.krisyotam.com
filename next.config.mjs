import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkGfm],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  // Static pages via generateStaticParams; server needed for build-time DB reads
}

export default withMDX(nextConfig)
