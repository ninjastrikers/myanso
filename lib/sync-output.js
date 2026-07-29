'use strict';

const SYNC_PREFIXES = ['\x1b[?2026', '\x1b[?202', '\x1b[?20', '\x1b[?2', '\x1b[?', '\x1b[', '\x1b'];
const SYNC_MARKER_NEEDLE = '?2026';
const SYNC_PREFIX_MAX = SYNC_PREFIXES[0].length;

function stripSynchronizedOutput(chunk, carry = '') {
  let data = String(carry || '') + String(chunk || '');
  let nextCarry = '';
  if (data.indexOf('\x1b') !== -1) {
    if (data.indexOf(SYNC_MARKER_NEEDLE) !== -1) {
      data = data.replace(/\x1b\[\?2026[hl]/g, '');
    }
    const tail = data.slice(-SYNC_PREFIX_MAX);
    const partial = SYNC_PREFIXES.find((prefix) => tail.endsWith(prefix));
    if (partial) {
      nextCarry = partial;
      data = data.slice(0, -partial.length);
    }
  }
  return { data, carry: nextCarry };
}

module.exports = { stripSynchronizedOutput };
