# Technical Caveats

## .md-First Code Generation System

### PostToolUse Hook Limitation
PostToolUse hook configured in `.claude/hooks/on-md-write.sh` does not trigger on file Write operations in current Claude Code version. Hook remains in place for future compatibility.

### Current Workflow
When editing any `.md` specification file:
1. User edits the `.md` file (source of truth)
2. Agent must manually invoke Task tool with subagent_type=general-purpose
3. Task reads the .md and all referenced Dependencies
4. Task uses write_file MCP tool to generate corresponding .js code
5. All .js files are auto-generated, never edit directly

### System Architecture
- 27 .md specification files are single source of truth
- All code derives from .md via agent + MCP write_file
- Agent must read all Dependencies section references transitively
- Generated code must properly import from referenced .md modules
