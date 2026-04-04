"use client"

import { CopyButton } from "./CopyButton"

interface CommandEntry {
  cmd: string
  desc: string
}

interface Section {
  title: string
  commands: CommandEntry[]
}

const sections: Section[] = [
  {
    title: "Basics",
    commands: [
      { cmd: "git init", desc: "Initialize a new repository" },
      { cmd: "git clone <url>", desc: "Clone a remote repository" },
      { cmd: "git status", desc: "Show working tree status" },
      { cmd: "git add <file>", desc: "Stage a file" },
      { cmd: "git add -A", desc: "Stage all changes" },
      { cmd: "git commit -m \"msg\"", desc: "Commit staged changes" },
      { cmd: "git commit --amend", desc: "Amend the last commit" },
      { cmd: "git diff", desc: "Show unstaged changes" },
      { cmd: "git diff --staged", desc: "Show staged changes" },
    ],
  },
  {
    title: "Branching",
    commands: [
      { cmd: "git branch", desc: "List local branches" },
      { cmd: "git branch <name>", desc: "Create a new branch" },
      { cmd: "git branch -d <name>", desc: "Delete a merged branch" },
      { cmd: "git branch -D <name>", desc: "Force-delete a branch" },
      { cmd: "git checkout <branch>", desc: "Switch to a branch" },
      { cmd: "git checkout -b <name>", desc: "Create and switch to a new branch" },
      { cmd: "git switch <branch>", desc: "Switch branches (modern)" },
      { cmd: "git switch -c <name>", desc: "Create and switch (modern)" },
      { cmd: "git merge <branch>", desc: "Merge branch into current" },
      { cmd: "git merge --no-ff <branch>", desc: "Merge with a merge commit" },
    ],
  },
  {
    title: "Remote",
    commands: [
      { cmd: "git remote -v", desc: "List remotes with URLs" },
      { cmd: "git remote add <name> <url>", desc: "Add a remote" },
      { cmd: "git fetch", desc: "Download remote refs and objects" },
      { cmd: "git pull", desc: "Fetch and merge remote branch" },
      { cmd: "git pull --rebase", desc: "Fetch and rebase instead of merge" },
      { cmd: "git push", desc: "Push commits to remote" },
      { cmd: "git push -u origin <branch>", desc: "Push and set upstream" },
      { cmd: "git push --force-with-lease", desc: "Force push safely" },
    ],
  },
  {
    title: "Stash",
    commands: [
      { cmd: "git stash", desc: "Stash working directory changes" },
      { cmd: "git stash list", desc: "List all stashes" },
      { cmd: "git stash pop", desc: "Apply and remove top stash" },
      { cmd: "git stash apply", desc: "Apply top stash without removing" },
      { cmd: "git stash drop", desc: "Remove top stash" },
      { cmd: "git stash show -p", desc: "Show stash diff" },
      { cmd: "git stash branch <name>", desc: "Create branch from stash" },
    ],
  },
  {
    title: "Log",
    commands: [
      { cmd: "git log", desc: "Show commit history" },
      { cmd: "git log --oneline", desc: "Compact one-line log" },
      { cmd: "git log --graph --oneline", desc: "ASCII graph log" },
      { cmd: "git log -p", desc: "Show patches with log" },
      { cmd: "git log --author=\"name\"", desc: "Filter by author" },
      { cmd: "git log --since=\"2 weeks ago\"", desc: "Filter by date" },
      { cmd: "git log --stat", desc: "Show file change stats" },
      { cmd: "git shortlog -sn", desc: "Commit count by author" },
      { cmd: "git blame <file>", desc: "Show who changed each line" },
    ],
  },
  {
    title: "Reset",
    commands: [
      { cmd: "git reset HEAD <file>", desc: "Unstage a file" },
      { cmd: "git reset --soft HEAD~1", desc: "Undo last commit, keep staged" },
      { cmd: "git reset --mixed HEAD~1", desc: "Undo last commit, keep unstaged" },
      { cmd: "git reset --hard HEAD~1", desc: "Undo last commit, discard changes" },
      { cmd: "git restore <file>", desc: "Discard working directory changes" },
      { cmd: "git restore --staged <file>", desc: "Unstage a file (modern)" },
      { cmd: "git clean -fd", desc: "Remove untracked files and dirs" },
    ],
  },
  {
    title: "Rebase",
    commands: [
      { cmd: "git rebase <branch>", desc: "Rebase current onto branch" },
      { cmd: "git rebase -i HEAD~n", desc: "Interactive rebase last n commits" },
      { cmd: "git rebase --continue", desc: "Continue after resolving conflicts" },
      { cmd: "git rebase --abort", desc: "Abort a rebase in progress" },
      { cmd: "git rebase --skip", desc: "Skip current conflicting commit" },
      { cmd: "git rebase --onto <new> <old>", desc: "Rebase onto a different base" },
    ],
  },
  {
    title: "Cherry-pick",
    commands: [
      { cmd: "git cherry-pick <sha>", desc: "Apply a specific commit" },
      { cmd: "git cherry-pick --no-commit <sha>", desc: "Apply without committing" },
      { cmd: "git cherry-pick <a>..<b>", desc: "Apply a range of commits" },
      { cmd: "git cherry-pick --abort", desc: "Abort a cherry-pick" },
      { cmd: "git cherry-pick --continue", desc: "Continue after resolving conflicts" },
    ],
  },
  {
    title: "Tags",
    commands: [
      { cmd: "git tag", desc: "List all tags" },
      { cmd: "git tag <name>", desc: "Create a lightweight tag" },
      { cmd: "git tag -a <name> -m \"msg\"", desc: "Create an annotated tag" },
      { cmd: "git tag -d <name>", desc: "Delete a local tag" },
      { cmd: "git push origin <tag>", desc: "Push a tag to remote" },
      { cmd: "git push origin --tags", desc: "Push all tags to remote" },
      { cmd: "git push origin :refs/tags/<tag>", desc: "Delete remote tag" },
    ],
  },
]

export function GitMemoTool() {
  return (
    <div>
      {sections.map(section => (
        <div className="tool-section" key={section.title}>
          <p className="tool-section-title">{section.title}</p>
          {section.commands.map(entry => (
            <div className="tool-output-row" key={entry.cmd}>
              <span className="tool-output-label" style={{ fontFamily: "monospace", fontSize: "0.8rem", minWidth: "280px" }}>{entry.cmd}</span>
              <span className="tool-output-value" style={{ fontSize: "0.82rem" }}>{entry.desc}</span>
              <CopyButton text={entry.cmd} />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
