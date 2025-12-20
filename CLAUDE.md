# .md-First Development Philosophy

## Core Principle
All code is maintained exclusively through `.md` files. Source files (`.js`, `.ts`, etc.) are generated artifacts derived from markdown documentation.

## Workflow
Write code documentation in `.md` files, full comprehensivei, concise specs, no code, must have enough instruction to deterministically produce the same code every time
`PostToolUse` hook detects when `.md` is written
Source files are never edited directly - only through their `.md` counterparts

## Rules
- Each `.md` file has a corresponding code file, you may not see it cause its gitignored (e.g., `index.md` → `index.js`)
- `.md` files are the single source of truth
- Only read referenced `.md` files when generating code - no external file exploration
- If code needs to reference another module, reference it explicitly in the `.md`
- If theres a repeated instruction for a group of files, put that repeated instruction in a .md and reference it from the other files
- All implementation details must be contained within or derived from markdown content

## Benefits
- Self-documenting code (docs are the code)
- Enforced simplicity and clarity
- Clear dependency documentation
- No stale comments or documentation drift

Never record any history anywhere
