#!/bin/bash

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
CLAUDE_FILE="$PROJECT_DIR/CLAUDE.md"

if [ ! -f "$CLAUDE_FILE" ]; then
  exit 0
fi

CONTEXT=$(cat "$CLAUDE_FILE")

cat <<EOF
{
  "hookSpecificOutput": {
    "hookEventName": "SessionStart",
    "additionalContext": $(echo "$CONTEXT" | jq -Rs .)
  }
}
EOF

exit 0
