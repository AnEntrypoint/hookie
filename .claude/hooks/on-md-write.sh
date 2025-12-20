#!/bin/bash

# Read hook input from stdin
read -r hook_input

# Extract file path from hook input
# The hook receives JSON with tool use information
FILE=$(echo "$hook_input" | grep -oP '"path":\s*"\K[^"]+' | head -1)

if [[ -z "$FILE" ]]; then
  # If path extraction failed, try to get from arguments
  FILE="$1"
fi

# Check if a .md file was written
if [[ "$FILE" == *.md ]]; then
  # Get the project directory
  PROJECT_DIR="${CLAUDE_PROJECT_DIR:-.}"
  GENERATOR_SCRIPT="${PROJECT_DIR}/.claude/generate-from-md.js"

  # Run the code generator in the background
  if [[ -f "$GENERATOR_SCRIPT" ]]; then
    (node "$GENERATOR_SCRIPT" "$FILE" 2>&1 | sed 's/^/[CodeGen] /') &

    echo ""
    echo "Auto-generating: $FILE → ${FILE%.md}.js"
    echo ""
  fi
fi
