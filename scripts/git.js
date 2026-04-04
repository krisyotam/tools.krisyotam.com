#!/usr/bin/env node
/**
 * git.js — Pre-push hook
 *
 * Runs sync-tools.js to rebuild the SQLite database from MDX front matter
 * before every push. Install by adding to package.json scripts or by
 * symlinking into .git/hooks/pre-push.
 *
 * Usage:
 *   node scripts/git.js          (manual run)
 *   npm run pre-push             (via package.json)
 */

const { execSync } = require("child_process")
const path = require("path")

const root = path.join(__dirname, "..")

console.log("[git] Syncing tools database from MDX front matter...")

try {
  execSync("node scripts/sync-tools.js", { cwd: root, stdio: "inherit" })
} catch (err) {
  console.error("[git] sync-tools.js failed — aborting push")
  process.exit(1)
}

// Stage the regenerated database so it's included in the push
try {
  execSync("git add public/data/tools.db", { cwd: root, stdio: "inherit" })
  // Check if there are staged changes to commit
  const status = execSync("git diff --cached --name-only", { cwd: root, encoding: "utf-8" }).trim()
  if (status) {
    execSync('git commit -m "chore: sync tools.db from MDX front matter"', {
      cwd: root,
      stdio: "inherit",
    })
    console.log("[git] tools.db updated and committed")
  } else {
    console.log("[git] tools.db already up to date")
  }
} catch (err) {
  console.error("[git] Failed to stage/commit tools.db")
  process.exit(1)
}
