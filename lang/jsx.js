'use strict';
const path = require('path');

module.exports = {
  id: 'jsx',
  exec: {
    match: /^exec:jsx/,
    run(code, cwd) {
      const acorn = require(path.join(cwd, 'node_modules', 'acorn'));
      const acornJsx = require(path.join(cwd, 'node_modules', 'acorn-jsx'));
      const parser = acorn.Parser.extend(acornJsx());
      try {
        parser.parse(code, { ecmaVersion: 2020, sourceType: 'module' });
        return 'OK';
      } catch (e) {
        return 'SyntaxError: ' + e.message;
      }
    }
  },
  lsp: {
    check(fileContent, cwd) {
      const p = require('path');
      try {
        const acorn = require(p.join(cwd, 'node_modules', 'acorn'));
        const acornJsx = require(p.join(cwd, 'node_modules', 'acorn-jsx'));
        const parser = acorn.Parser.extend(acornJsx());
        parser.parse(fileContent, { ecmaVersion: 2020, sourceType: 'module' });
        return [];
      } catch (e) {
        return [{ line: (e.loc && e.loc.line) || 1, col: (e.loc && e.loc.column) || 0, severity: 'error', message: e.message }];
      }
    }
  },
  extensions: ['.js', '.jsx'],
  context: `=== jsx: JSX/JS syntax checker ===
exec:jsx
<js/jsx code>

Validates syntax with acorn+acorn-jsx. Returns "OK" or "SyntaxError: <msg>". Use before committing to catch parse errors in .js/.jsx files.`
};
