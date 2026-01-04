// Suppress media query warnings from inline styles
// The app uses @media rules in inline styles which is invalid in React
// This is a temporary suppressant until styles are moved to CSS files
const originalWarn = console.warn;
console.warn = function(...args) {
  if (args[0]?.includes?.('Unsupported style property') && args[1]?.includes?.('@media')) {
    return;
  }
  originalWarn.apply(console, args);
};
