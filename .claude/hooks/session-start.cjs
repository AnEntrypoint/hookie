#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

try {
  const claudeMdPath = path.join(projectDir, 'CLAUDE.md');

  if (fs.existsSync(claudeMdPath)) {
    const content = fs.readFileSync(claudeMdPath, 'utf-8');
    console.log(content);
  }
} catch (e) {
  // Silently fail if file doesn't exist
}
