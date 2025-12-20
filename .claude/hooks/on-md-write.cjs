#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();

let aborted = false;
process.on('SIGTERM', () => { aborted = true; });
process.on('SIGINT', () => { aborted = true; });

const run = () => {
  if (aborted) return { decision: undefined };

  let hookInput = '';
  try {
    hookInput = fs.readFileSync(0, 'utf-8');
  } catch (e) {
    return { decision: undefined };
  }

  try {
    const filePathMatch = hookInput.match(/"file_path":\s*"([^"]+)"/);
    const filePath = filePathMatch ? filePathMatch[1] : null;

    if (!filePath) {
      return { decision: undefined };
    }

    if (filePath.endsWith('.md')) {
      const codeFile = filePath.replace(/\.md$/, '.js');
      const fileName = path.basename(filePath, '.md');

      return {
        decision: 'block',
        reason: `Markdown specification updated: ${filePath}\n\nYou must regenerate the corresponding JavaScript implementation:\n\n  Spec File: ${filePath}\n  Implementation Target: ${codeFile}\n\nAction Required:\nUse the Task tool with the frontend-react-expert agent to:\n1. Read the markdown specification at ${filePath}\n2. Generate a production-grade React component that implements the design specifications\n3. Write the implementation to ${codeFile} using the Write tool\n\nThe component spec has been updated with design specifications, styling requirements, and implementation details that must be followed.`
      };
    }

    return { decision: undefined };
  } catch (e) {
    return { decision: undefined };
  }
};

try {
  const result = run();
  if (result.decision === 'block') {
    console.log(JSON.stringify({ decision: result.decision, reason: result.reason }));
    process.exit(2);
  }
} catch (e) {
  process.exit(1);
}
