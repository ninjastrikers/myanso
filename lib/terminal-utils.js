'use strict';

const { fileURLToPath } = require('url');

function quoteShellPath(value, platform = process.platform) {
  const p = String(value);
  if (platform === 'win32') return `'${p.replace(/'/g, "''")}'`;
  return `'${p.replace(/'/g, `'\\''`)}'`;
}

function parseOsc7(data, platform = process.platform) {
  try {
    return fileURLToPath(data, { windows: platform === 'win32' });
  } catch (_) {
    return '';
  }
}

function terminalBasename(value, platform = process.platform) {
  if (!value) return '';
  const parts = String(value).replace(/[/\\]+$/, '').split(/[/\\]/);
  return parts[parts.length - 1] || (platform === 'win32' ? '' : '/');
}

module.exports = { quoteShellPath, parseOsc7, terminalBasename };
