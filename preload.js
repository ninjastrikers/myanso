'use strict';

// Run the UI in Electron's isolated preload world after index.html exists.
// The page's main world receives no Node.js or Electron globals.
window.addEventListener('DOMContentLoaded', () => {
  require('./renderer.js');
}, { once: true });
