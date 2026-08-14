'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { insertionIndex, edgeScrollVelocity } = require('../lib/tab-drag');

test('insertionIndex returns every possible slot', () => {
  assert.equal(insertionIndex([100, 200, 300], 50), 0);
  assert.equal(insertionIndex([100, 200, 300], 150), 1);
  assert.equal(insertionIndex([100, 200, 300], 299), 2);
  assert.equal(insertionIndex([100, 200, 300], 301), 3);
});

test('insertionIndex supports the final position after removing the source', () => {
  // Dragging the first tab across peers B and C must be able to land after C.
  assert.equal(insertionIndex([120, 240], 500), 2);
});

test('edgeScrollVelocity is bounded and directional', () => {
  assert.equal(edgeScrollVelocity(100, 100, 500), -12);
  assert.equal(edgeScrollVelocity(500, 100, 500), 12);
  assert.equal(edgeScrollVelocity(300, 100, 500), 0);
  assert.equal(edgeScrollVelocity(122, 100, 500), -2.571428571428571);
  assert.equal(edgeScrollVelocity(478, 100, 500), 2.571428571428571);
});
