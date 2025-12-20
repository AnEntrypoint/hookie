#!/bin/bash

read -r hook_input

# Extract file_path from tool_input
FILE=$(echo "$hook_input" | grep -oP '"file_path":\s*"\K[^"]+' | head -1)

# Only process .md files
if [[ "$FILE" == *.md ]]; then
  CODE_FILE="${FILE%.md}.js"

  cat >&2 <<EOF
Markdown specification was modified: $FILE

Please generate the JavaScript/TypeScript implementation for this specification.
Read the specification file: $FILE
Write the implementation to: $CODE_FILE
EOF

  exit 2
fi

exit 0
