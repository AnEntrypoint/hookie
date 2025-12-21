#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

async function handleRequest(request) {
  if (request.method === 'initialize') {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      serverInfo: {
        name: 'write-file-mcp',
        version: '1.0.0'
      }
    };
  }

  if (request.method === 'tools/list') {
    return {
      tools: [
        {
          name: 'write_file',
          description: 'Write content to a file at the specified path',
          inputSchema: {
            type: 'object',
            properties: {
              file_path: {
                type: 'string',
                description: 'Absolute path where to write the file'
              },
              content: {
                type: 'string',
                description: 'File content to write'
              }
            },
            required: ['file_path', 'content']
          }
        }
      ]
    };
  }

  if (request.method === 'tools/call') {
    const { name, arguments: args } = request.params;

    if (name === 'write_file') {
      try {
        const filePath = args.file_path;
        const content = args.content;

        if (!filePath || typeof filePath !== 'string') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  message: 'Invalid file_path: must be a non-empty string'
                })
              }
            ]
          };
        }

        if (content === undefined || content === null) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  message: 'Invalid content: must be provided'
                })
              }
            ]
          };
        }

        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, String(content), 'utf-8');

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                message: `File written successfully: ${filePath}`,
                file_path: filePath,
                size: String(content).length
              })
            }
          ]
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                message: `Error writing file: ${error.message}`
              })
            }
          ]
        };
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            success: false,
            message: `Unknown tool: ${name}`
          })
        }
      ]
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({
          success: false,
          message: `Unknown method: ${request.method}`
        })
      }
    ]
  };
}

rl.on('line', async (line) => {
  try {
    const request = JSON.parse(line);
    const result = await handleRequest(request);
    const response = {
      jsonrpc: '2.0',
      id: request.id,
      result
    };
    console.log(JSON.stringify(response));
  } catch (error) {
    console.log(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: error.message
        }
      })
    );
  }
});

rl.on('error', (error) => {
  process.exit(1);
});
