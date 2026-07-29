'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { quoteShellPath, parseOsc7, terminalBasename } = require('../lib/terminal-utils');

test('quotes POSIX paths without executing shell syntax', () => {
  assert.equal(quoteShellPath('/tmp/a b', 'darwin'), "'/tmp/a b'");
  assert.equal(quoteShellPath("/tmp/a'b", 'linux'), "'/tmp/a'\\''b'");
  assert.equal(quoteShellPath('/tmp/-flag\nnext', 'linux'), "'/tmp/-flag\nnext'");
});

test('quotes PowerShell paths and doubles embedded quotes', () => {
  assert.equal(quoteShellPath("C:\\A B\\it's.txt", 'win32'), "'C:\\A B\\it''s.txt'");
});

test('parses POSIX and Windows OSC 7 URLs including Myanmar text', () => {
  assert.equal(parseOsc7('file:///tmp/%E1%80%99%E1%80%BC%E1%80%94%E1%80%BA%E1%80%99%E1%80%AC', 'linux'), '/tmp/မြန်မာ');
  assert.equal(parseOsc7('file:///C:/Users/Test', 'win32'), 'C:\\Users\\Test');
  assert.equal(parseOsc7('not a url', 'linux'), '');
});

test('gets terminal basenames across separator styles', () => {
  assert.equal(terminalBasename('/tmp/project/', 'linux'), 'project');
  assert.equal(terminalBasename('C:\\Users\\Test\\', 'win32'), 'Test');
  assert.equal(terminalBasename('/', 'linux'), '/');
});
