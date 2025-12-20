#!/bin/bash

read -r hook_input
FILE=$(echo "$hook_input" | grep -oP '"path":\s*"\K[^"]+' | head -1)

if [[ -z "$FILE" ]]; then
  FILE="$1"
fi

if [[ "$FILE" == *.md ]]; then
  CODE_FILE="${FILE%.md}.js"
  cat <<EOF

.md specification written: $FILE

Use Task tool with subagent_type=general-purpose to:
1. Read markdown file: $FILE
2. Design and implement the code from specification
3. Use write_file MCP tool to output: $CODE_FILE

Ensure code references dependencies declared in the .md Dependencies section.
EOF
fi
