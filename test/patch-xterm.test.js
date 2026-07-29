'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { applyPatch, targets } = require('../patches/patch-xterm-myanmar');

function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'myanso-patch-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const installed = path.join(__dirname, '..', 'node_modules', '@xterm', 'xterm', 'lib');
  for (const name of new Set(targets.map((target) => target.name))) {
    let src = fs.readFileSync(path.join(installed, name), 'utf8');
    for (const target of [...targets].reverse().filter((item) => item.name === name)) {
      src = src.replace(target.replace, target.find);
    }
    fs.writeFileSync(path.join(dir, name), src);
  }
  return dir;
}

test('applies all targets and is idempotent', (t) => {
  const dir = fixture(t);
  assert.equal(applyPatch(dir, () => {}), 6);
  const once = new Map([...new Set(targets.map((target) => target.name))].map((name) => [name, fs.readFileSync(path.join(dir, name), 'utf8')]));
  assert.equal(applyPatch(dir, () => {}), 6);
  for (const [name, src] of once) assert.equal(fs.readFileSync(path.join(dir, name), 'utf8'), src);
});

test('fails when an expected file is missing', (t) => {
  const dir = fixture(t);
  fs.rmSync(path.join(dir, targets[0].name));
  assert.throws(() => applyPatch(dir, () => {}), /missing/);
});

test('validates all targets before writing any file', (t) => {
  const dir = fixture(t);
  const firstFile = path.join(dir, targets[0].name);
  const before = fs.readFileSync(firstFile, 'utf8');
  const broken = targets.find((target) => target.name !== targets[0].name);
  const brokenFile = path.join(dir, broken.name);
  fs.writeFileSync(brokenFile, fs.readFileSync(brokenFile, 'utf8').replace(broken.find, 'changed-minifier-target'));
  assert.throws(() => applyPatch(dir, () => {}), /Expected v6\.0\.0/);
  assert.equal(fs.readFileSync(firstFile, 'utf8'), before);
});
