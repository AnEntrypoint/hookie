#!/bin/bash

FILE="$1"

if [[ "$FILE" == *.md ]]; then
  BASENAME="${FILE%.md}"
  CODE_FILE="${BASENAME}.js"

  cat <<EOF
A .md file was written: $FILE

Use the Task tool with a prompt that instructs an agent to:
1. Read the markdown file at: $FILE
2. Extract the code content from the markdown
3. Use the 'write_file' MCP tool to write the code to: $CODE_FILE

CRITICAL INSTRUCTIONS:
- Only read $FILE - do not read any other files from the codebase
- Only reference external files if they are explicitly mentioned in the markdown itself
- All code must be fully contained within or explicitly derived from the markdown content
- Do not explore, analyze, or reference any files outside of what the markdown specifies

The write_file tool is available through the file-writer MCP server.
EOF
fi
