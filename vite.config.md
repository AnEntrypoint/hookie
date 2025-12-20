# Vite Configuration

## Purpose
Build configuration for the CMS application using Vite as the build tool and dev server.

## Export
Export a Vite configuration object as default export.

## Configuration Structure

### Plugins
Use the React plugin for JSX/TSX support:
```
import react from '@vitejs/plugin-react'

plugins: [react()]
```

### Root
Set root directory:
```
root: '.'
```

### Entry Point
Main entry file:
```
// Vite automatically looks for index.html in root
// index.html should reference src/index.js
```

### Build Configuration
```
build: {
  outDir: 'dist',
  emptyOutDir: true,
  sourcemap: true,
  rollupOptions: {
    input: {
      main: './index.html'
    }
  }
}
```

### Server Configuration
```
server: {
  port: 5173,
  open: true,
  cors: true,
  proxy: {
    // Add proxy for GitHub API if needed to avoid CORS
    '/api/github': {
      target: 'https://api.github.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/github/, '')
    }
  }
}
```

### Environment Variables
Define which env vars are exposed to the client:
```
define: {
  'import.meta.env.VITE_GITHUB_CLIENT_ID': JSON.stringify(process.env.VITE_GITHUB_CLIENT_ID),
  'import.meta.env.VITE_GITHUB_REDIRECT_URI': JSON.stringify(process.env.VITE_GITHUB_REDIRECT_URI),
  'import.meta.env.VITE_GITHUB_OWNER': JSON.stringify(process.env.VITE_GITHUB_OWNER),
  'import.meta.env.VITE_GITHUB_REPO': JSON.stringify(process.env.VITE_GITHUB_REPO)
}
```

Or use Vite's automatic env loading (recommended):
```
// Vite automatically loads .env files
// Variables prefixed with VITE_ are exposed
```

### Public Directory
```
publicDir: 'public'
```

### Resolve
Configure module resolution:
```
resolve: {
  alias: {
    '@': '/src',
    '@components': '/src/components',
    '@lib': '/src/lib',
    '@admin': '/src/admin',
    '@public': '/src/public'
  }
}
```

### Optimizations
```
build: {
  minify: 'esbuild',
  target: 'es2015',
  chunkSizeWarningLimit: 1000,
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend']
      }
    }
  }
}
```

### Preview Configuration
```
preview: {
  port: 4173,
  open: true
}
```

## Full Configuration
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  root: '.',

  publicDir: 'public',

  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@lib': '/src/lib',
      '@admin': '/src/admin',
      '@public': '/src/public'
    }
  },

  server: {
    port: 5173,
    open: true,
    cors: true
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    minify: 'esbuild',
    target: 'es2015',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend']
        }
      }
    }
  },

  preview: {
    port: 4173,
    open: true
  }
})
```

## Environment Variables
Create `.env` file with:
```
VITE_GITHUB_CLIENT_ID=your_client_id
VITE_GITHUB_REDIRECT_URI=http://localhost:5173/
VITE_GITHUB_OWNER=your_username
VITE_GITHUB_REPO=your_repo
```

Variables prefixed with `VITE_` are automatically exposed to the client code.

## Scripts in package.json
Suggested npm scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext js,jsx"
  }
}
```

## Dependencies
Required packages:
- `vite` - Build tool
- `@vitejs/plugin-react` - React plugin for Vite
- `react` - React library
- `react-dom` - React DOM library
- `react-dnd` - Drag and drop
- `react-dnd-html5-backend` - HTML5 backend for react-dnd

## Dev Dependencies
- `eslint` - Linting
- `@types/react` - TypeScript types (if using TS)
- `@types/react-dom` - TypeScript types (if using TS)

## Implementation Notes
- Use Vite for fast HMR (Hot Module Replacement)
- Configure code splitting for better performance
- Enable source maps for debugging
- Use environment variables for sensitive data
- Configure CORS if needed for API calls
- Set up path aliases for cleaner imports
- Optimize chunk sizes
- Enable compression in production
- Configure for SPA routing (handle 404s)
- Support legacy browsers if needed (adjust target)
