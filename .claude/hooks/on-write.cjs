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

      return {
        decision: 'block',
        reason: `📝 Markdown specification updated: ${filePath}\n\n⚠️  ACTION REQUIRED - Regenerate JavaScript Implementation\n\nTarget File: ${codeFile}\n\nSteps:\n1. Use the Task tool with the frontend-react-expert agent\n2. Read the markdown specification at ${filePath}\n3. Generate a production-grade React component implementation\n4. Write the implementation to ${codeFile}\n\nThe component spec has been updated with design specifications, styling requirements, and implementation details that must be followed.`
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
  }
} catch (e) {
}
