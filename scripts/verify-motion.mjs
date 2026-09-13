import assert from 'node:assert/strict';
import {
  advanceTransition,
  createTransition,
  livingPoint,
  MORPH_DURATION,
} from '../src/particle-motion.ts';

const source = Array.from({ length: 120 }, (_, i) => ({
  x: Math.sin(i) * 0.8,
  y: Math.cos(i) * 0.8,
  z: 0,
  size: 1.5,
}));
const destination = source.map((point, i) => ({
  x: ((i % 8) - 3.5) * 0.29,
  y: i / 120 - 0.5,
  z: 0.1,
  size: 1.3,
}));
const clone = (points) => points.map((point) => ({ ...point }));
const distance = (left, right) =>
  Math.sqrt(
    left.reduce(
      (sum, p, i) =>
        sum +
        (p.x - right[i].x) ** 2 +
        (p.y - right[i].y) ** 2 +
        (p.z - right[i].z) ** 2,
      0,
    ) / left.length,
  );
const points = clone(source);
const transition = createTransition(points, destination);
advanceTransition(transition, points, 0);
assert.deepEqual(
  points,
  source,
  'A tab change must start at the currently displayed shape',
);
advanceTransition(transition, points, MORPH_DURATION * 0.4);
assert(
  distance(points, source) > 0.25 && distance(points, destination) > 0.25,
  'The dispersion must be visibly distinct from both symbols',
);
assert(
  points.every(
    (p) => Number.isFinite(p.x) && Math.abs(p.x) < 1.2 && Math.abs(p.y) < 1.2,
  ),
  'Scattered particles stay inside the composition',
);
const interrupted = clone(points);
const reverse = createTransition(points, source);
advanceTransition(reverse, points, 0);
assert.deepEqual(
  points,
  interrupted,
  'A rapid second click must not snap particles to a stale symbol',
);
advanceTransition(reverse, points, MORPH_DURATION);
assert.deepEqual(
  points,
  source,
  'A completed transition must exactly form its symbol',
);
const simulate = (hz, duration) => {
  const result = clone(source);
  const motion = createTransition(result, destination);
  for (let frame = 0; frame < Math.round(hz * duration); frame++)
    advanceTransition(motion, result, 1 / hz);
  return result;
};
assert(
  distance(simulate(30, 1), simulate(120, 1)) < 1e-10,
  'Motion speed should be independent of refresh rate',
);
assert(
  distance(simulate(60, 0.6), destination) > 0.1,
  'Assembly must not complete abruptly',
);
assert(
  distance(simulate(60, 1.2), destination) === 0,
  'The full transition should settle after 1.2 seconds',
);
const rest = source.map((point, index) => livingPoint(point, index, 0));
const later = source.map((point, index) => livingPoint(point, index, 2));
assert(distance(rest, later) > 0.01, 'Settled particles continue to move');
assert(
  distance(later, source) < 0.04,
  'Idle movement preserves the recognisable outline',
);
assert.deepEqual(
  points,
  source,
  'Idle movement must never mutate the underlying geometry',
);
console.log(
  'PASS: 1.2-second reconstruction, continuous interruption, bounded idle motion, consistent timing at 30/120 Hz.',
);
