'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { stripSynchronizedOutput } = require('../lib/sync-output');

for (const marker of ['\x1b[?2026h', '\x1b[?2026l']) {
  test(`removes complete ${JSON.stringify(marker)} marker`, () => {
    assert.deepEqual(stripSynchronizedOutput(`before${marker}after`), { data: 'beforeafter', carry: '' });
  });

  test(`removes ${JSON.stringify(marker)} at every chunk boundary`, () => {
    for (let split = 1; split < marker.length; split++) {
      const first = stripSynchronizedOutput(`မြန်မာ${marker.slice(0, split)}`);
      const second = stripSynchronizedOutput(`${marker.slice(split)}စာ`, first.carry);
      assert.equal(first.data + second.data, 'မြန်မာစာ', `split ${split}`);
      assert.equal(second.carry, '', `split ${split}`);
    }
  });
}

test('removes multiple markers and preserves surrounding output', () => {
  const data = `a\x1b[?2026hb\x1b[?2026lc`;
  assert.deepEqual(stripSynchronizedOutput(data), { data: 'abc', carry: '' });
});

test('carries every partial marker prefix', () => {
  for (const prefix of ['\x1b', '\x1b[', '\x1b[?', '\x1b[?2', '\x1b[?20', '\x1b[?202', '\x1b[?2026']) {
    assert.deepEqual(stripSynchronizedOutput(`text${prefix}`), { data: 'text', carry: prefix });
  }
});

test('releases a carried prefix when the next chunk is unrelated', () => {
  assert.deepEqual(stripSynchronizedOutput('XYZ', '\x1b[?2'), { data: '\x1b[?2XYZ', carry: '' });
});

test('preserves ordinary CSI and SGR sequences byte-for-byte', () => {
  const data = '\x1b[31mred\x1b[0m\x1b[2J';
  assert.deepEqual(stripSynchronizedOutput(data), { data, carry: '' });
});

test('handles empty and marker-only chunks', () => {
  assert.deepEqual(stripSynchronizedOutput(''), { data: '', carry: '' });
  assert.deepEqual(stripSynchronizedOutput('\x1b[?2026h'), { data: '', carry: '' });
});
