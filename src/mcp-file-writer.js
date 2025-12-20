#!/usr/bin/env node
const fs = require('fs').promises;
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  try {
    const message = JSON.parse(line);

    if (message.method === 'initialize') {
      process.stdout.write(JSON.stringify({
        protocolVersion: '2024-11-05',
        capabilities: {},
        serverInfo: {
          name: 'file-writer',
          version: '1.0.0'
        }
      }) + '\n');
    } else if (message.method === 'tools/list') {
      process.stdout.write(JSON.stringify({
        tools: [{
          name: 'write_file',
          description: 'Write or replace a file with provided contents',
          inputSchema: {
            type: 'object',
            properties: {
              path: { type: 'string', description: 'File path to write' },
              contents: { type: 'string', description: 'File contents' }
            },
            required: ['path', 'contents']
          }
        }]
      }) + '\n');
    } else if (message.method === 'tools/call') {
      const { name, arguments: args } = message.params;
      if (name === 'write_file') {
        await fs.writeFile(args.path, args.contents, 'utf-8');
        process.stdout.write(JSON.stringify({
          content: [{ type: 'text', text: `File written: ${args.path}` }]
        }) + '\n');
      }
    }
  } catch (err) {
    process.stderr.write(err.message + '\n');
  }
});
