#!/usr/bin/env node

/**
 * Simple MCP server for writing files
 * Provides a single tool: write_file
 * Input: { file_path: string, content: string }
 * Output: { success: boolean, message: string }
 */

const fs = require('fs');
const path = require('path');

const STDIO_TRANSPORT = {
  send: (msg) => process.stdout.write(JSON.stringify(msg) + '\n'),
  receive: () => {
    return new Promise((resolve) => {
      process.stdin.once('data', (data) => {
        try {
          resolve(JSON.parse(data.toString()));
        } catch (e) {
          resolve(null);
        }
      });
    });
  }
};

// Simple request/response handler
async function handleRequest(request) {
  if (request.method === 'initialize') {
    return {
      protocolVersion: '2024-11-05',
      capabilities: {},
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

        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Write the file
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

// Main loop
async function main() {
  // Read requests from stdin and send responses to stdout
  while (true) {
    try {
      const data = await new Promise((resolve, reject) => {
        process.stdin.once('data', (chunk) => {
          try {
            resolve(JSON.parse(chunk.toString()));
          } catch (e) {
            reject(e);
          }
        });
        process.stdin.once('error', reject);
      });

      const response = await handleRequest(data);
      console.log(JSON.stringify(response));
    } catch (error) {
      console.log(
        JSON.stringify({
          error: {
            code: -32603,
            message: error.message
          }
        })
      );
    }
  }
}

main().catch(console.error);
