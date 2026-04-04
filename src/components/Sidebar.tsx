"use client";

import { useState, useMemo } from "react";
import { useTheme } from "@/lib/theme-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToolInfo {
  name: string;
  slug: string;
  category: string;
  icon: string;
}

interface SidebarProps {
  tools: ToolInfo[];
}

const iconCache = new Map<string, LucideIcon>();
function getIcon(name: string): LucideIcon {
  let icon = iconCache.get(name);
  if (!icon) {
    icon = (icons as Record<string, LucideIcon>)[name] || icons.FileText;
    iconCache.set(name, icon);
  }
  return icon;
}

function FolderIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
        flexShrink: 0,
      }}
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function Sidebar({ tools }: SidebarProps) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const activeSlug = pathname === "/" ? null : pathname.replace(/^\//, "");

  const grouped = useMemo(() => {
    const g: Record<string, ToolInfo[]> = {};
    for (const tool of tools) {
      if (!g[tool.category]) g[tool.category] = [];
      g[tool.category].push(tool);
    }
    return g;
  }, [tools]);

  const lq = searchQuery.toLowerCase();
  const isSearching = lq.length > 0;

  const filteredGroups = useMemo(() => {
    const fg: Record<string, ToolInfo[]> = {};
    for (const [cat, catTools] of Object.entries(grouped)) {
      const filtered = isSearching
        ? catTools.filter(t => t.name.toLowerCase().includes(lq) || t.slug.toLowerCase().includes(lq) || t.category.toLowerCase().includes(lq))
        : catTools;
      if (filtered.length > 0) fg[cat] = filtered;
    }
    return fg;
  }, [grouped, lq, isSearching]);

  const toggleCategory = (cat: string) => {
    setCollapsed(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="profile-bento">
          <div className="profile-bento-row">
            <div className="profile-bento-cell profile-info-cell">
              <h1 className="profile-name">
                <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                  tools.krisyotam.com
                </Link>
              </h1>
              <p className="profile-subtitle">browser utilities</p>
            </div>
            <button
              className="profile-bento-cell theme-toggle-cell"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
          </div>
          <div className="profile-bento-row search-row">
            <input
              type="text"
              className="search-input"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <nav className="sidebar-content">
        <div className="folder-tree">
          {Object.entries(filteredGroups).map(([category, catTools]) => {
            const isCollapsed = isSearching ? false : (collapsed[category] ?? false);
            return (
              <div key={category}>
                <div className="category-label" onClick={() => toggleCategory(category)}>
                  <FolderIcon expanded={!isCollapsed} />
                  <span>{category}</span>
                </div>
                {!isCollapsed && (
                  <div className="folder-children">
                    {catTools.map(tool => {
                      const Icon = getIcon(tool.icon);
                      const isActive = activeSlug === tool.slug;
                      return (
                        <Link
                          key={tool.slug}
                          href={`/${tool.slug}`}
                          className={`folder-item ${isActive ? "active" : ""}`}
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <Icon size={14} style={{ flexShrink: 0, opacity: 0.7 }} />
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {tool.name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
