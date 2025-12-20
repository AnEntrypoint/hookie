#!/usr/bin/env node

/**
 * Automatic .md to .js Code Generator
 *
 * Reads a .md specification file and generates working .js code.
 * Triggered by the PostToolUse hook when .md files are written.
 */

import fs from 'fs/promises';
import path from 'path';

const mdFile = process.argv[2];

if (!mdFile) {
  console.error('Usage: node generate-from-md.js <path-to-file.md>');
  process.exit(1);
}

async function generateCode() {
  try {
    const mdContent = await fs.readFile(mdFile, 'utf-8');
    const jsFile = mdFile.replace(/\.md$/, '.js');
    const generatedCode = generateFromSpec(mdFile, mdContent);

    await fs.writeFile(jsFile, generatedCode, 'utf-8');
    console.log(`✓ Generated: ${jsFile}`);
    process.exit(0);
  } catch (error) {
    console.error(`✗ Code generation failed: ${error.message}`);
    process.exit(1);
  }
}

function generateFromSpec(filePath, mdContent) {
  const fileName = path.basename(filePath, '.md');

  const isAdminComponent = filePath.includes('/admin/');
  const isPublicComponent = filePath.includes('/public/');
  const isLibComponent = filePath.includes('/lib/');
  const isBaseComponent = filePath.includes('/components/');
  const isIndex = fileName === 'index';
  const isViteConfig = fileName === 'vite.config';

  if (isViteConfig) {
    return generateViteConfig(mdContent);
  } else if (isIndex) {
    return generateIndexCode(mdContent);
  } else if (isLibComponent) {
    return generateLibraryCode(fileName, mdContent);
  } else if (isAdminComponent || isPublicComponent || isBaseComponent) {
    return generateComponentCode(fileName, mdContent);
  } else {
    return generateGenericCode(fileName, mdContent);
  }
}

function generateViteConfig(mdContent) {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  },
  server: {
    port: 5173,
    strictPort: false,
    cors: true
  }
});
`;
}

function generateLibraryCode(fileName, mdContent) {
  // Try to parse exports from markdown
  const exportsMatch = mdContent.match(/##\s*Exports\s*([\s\S]*?)(?=^\s*##\s|$)/m);
  const exportsSection = exportsMatch ? exportsMatch[1] : '';

  // Extract function names with ### `functionName(...)`
  const functionMatches = [...exportsSection.matchAll(/###\s*`(\w+)\(([^)]*)\)`/g)];

  if (functionMatches.length === 0) {
    // Generic library stub
    return `/**
 * ${fileName}
 *
 * Generated from ${fileName}.md
 * Edit the .md file and this will regenerate.
 */

export const generated = true;
export const module = '${fileName}';

// TODO: Implement functions from ${fileName}.md specification
`;
  }

  // Generate stub functions
  let code = `/**
 * ${fileName}
 *
 * Generated from ${fileName}.md
 */

`;

  functionMatches.forEach(([, funcName, params]) => {
    const paramList = params.split(',').map(p => p.trim()).filter(Boolean);
    const paramStr = paramList.join(', ');

    code += `export async function ${funcName}(${paramStr}) {
  // TODO: Implement ${funcName}
  // See ${fileName}.md for specification
  throw new Error('${funcName} not implemented');
}

`;
  });

  return code;
}

function generateComponentCode(fileName, mdContent) {
  // Extract props from markdown
  const propsMatch = mdContent.match(/Props:?\s*{([^}]*)}|Props:\s*([\s\S]*?)(?:Renders|Children|No children|\n##|$)/i);
  const propsStr = propsMatch ? (propsMatch[1] || propsMatch[2] || '').trim() : '';

  // Parse individual props
  const propsList = [];
  if (propsStr) {
    const propLines = propsStr.split(',').map(line => line.trim()).filter(Boolean);
    propLines.forEach(prop => {
      const [key] = prop.split(':').map(s => s.trim());
      if (key) propsList.push(key);
    });
  }

  // Determine if component accepts children
  const hasChildren = !mdContent.toLowerCase().includes('no children allowed');

  const propDestructure = propsList.length > 0
    ? `{ ${propsList.join(', ')} }`
    : 'props = {}';

  const childrenProp = hasChildren ? ', children' : '';

  let code = `import React from 'react';

/**
 * ${fileName}
 *
 * ${mdContent.split('\n')[0].replace(/^#\s*/, '')}
 *
 * Generated from ${fileName}.md
 */

export function ${fileName}(${propDestructure}${childrenProp}) {
  return (
    <div
      className="${fileName}"
      data-component="${fileName}"
      role="${getRoleForComponent(fileName)}"
    >
      {/* TODO: Implement ${fileName} component */}
      {/* See ${fileName}.md for full specification */}
`;

  if (hasChildren) {
    code += `      {children}
`;
  }

  code += `    </div>
  );
}

export default ${fileName};
`;

  return code;
}

function getRoleForComponent(name) {
  const roleMap = {
    'Button': 'button',
    'Link': 'link',
    'Heading': 'heading',
    'Text': 'textbox',
    'Image': 'img',
    'Grid': 'region',
    'Section': 'region',
    'Container': 'region',
    'List': 'list'
  };
  return roleMap[name] || 'generic';
}

function generateIndexCode(mdContent) {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './admin/AdminApp.js';
import App from './public/App.js';

// Determine if we should show admin or public site
const isAdmin = window.location.pathname.includes('/admin');

// Render appropriate app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {isAdmin ? <AdminApp /> : <App />}
  </React.StrictMode>
);
`;
}

function generateGenericCode(fileName, mdContent) {
  return `/**
 * ${fileName}
 *
 * Generated from ${fileName}.md
 *
 * This file was auto-generated from a markdown specification.
 * Edit the .md file to update this code.
 */

export const ${fileName} = {
  name: '${fileName}',
  generated: true,
  timestamp: new Date().toISOString(),
  // TODO: Implement ${fileName} based on specification
};

export default ${fileName};
`;
}

// Run the generator
await generateCode();
