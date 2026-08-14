'use strict';

// Return the insertion slot in a list of tab midpoints. The dragged tab is
// intentionally excluded from the midpoint list by the caller, so the return
// value is already the final index after the dragged tab is removed.
function insertionIndex(midpoints, pointerX) {
  const index = midpoints.findIndex((midpoint) => pointerX < midpoint);
  return index === -1 ? midpoints.length : index;
}

// Return a bounded horizontal scroll velocity while a pointer is near an edge
// of the scrollable tab bar. The value is expressed in CSS pixels per frame.
function edgeScrollVelocity(pointerX, left, right, edge = 28, max = 12) {
  if (pointerX < left + edge) {
    const intensity = Math.min(1, (left + edge - pointerX) / edge);
    return -max * intensity;
  }
  if (pointerX > right - edge) {
    const intensity = Math.min(1, (pointerX - (right - edge)) / edge);
    return max * intensity;
  }
  return 0;
}

module.exports = { insertionIndex, edgeScrollVelocity };
