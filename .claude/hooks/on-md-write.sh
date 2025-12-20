#!/bin/bash

read -r hook_input

FILE=$(echo "$hook_input" | grep -oP '"file_path":\s*"\K[^"]+' | head -1)
if [[ -z "$FILE" ]]; then
  FILE=$(echo "$hook_input" | grep -oP '"path":\s*"\K[^"]+' | head -1)
fi

if [[ -z "$FILE" ]]; then
  FILE="$1"
fi

echo "Hook triggered. FILE=$FILE" >> /tmp/hook-debug.log

if [[ "$FILE" == *.md ]]; then
  CODE_FILE="${FILE%.md}.js"
  echo "Processing .md file: $FILE -> $CODE_FILE" >> /tmp/hook-debug.log
  cat <<EOF

.md specification written: $FILE

Use Task tool with subagent_type=general-purpose to:
1. Read markdown file: $FILE
2. Extract all referenced .md files from Dependencies section
3. Read each referenced .md file to understand dependencies
4. Design and implement code based on full specification context
5. Ensure all imports reference the dependency .md files correctly
6. Use write_file MCP tool to output: $CODE_FILE

Agent MUST read all markdown dependencies transitively before generating code.
EOF
else
  echo "File is not .md: $FILE" >> /tmp/hook-debug.log
fi
