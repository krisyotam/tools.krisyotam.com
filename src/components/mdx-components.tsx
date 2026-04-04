import type { MDXComponents } from "mdx/types"
import { Box } from "./Box"
import { ToolLayout } from "./ToolLayout"

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Box,
    ToolLayout,
    ...components,
  }
}
