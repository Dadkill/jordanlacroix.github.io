export type Point = { x: number; y: number; z: number; size: number };
export const MORPH_DURATION = 1.2;
export const randomFor = (n: number) => {
  const value = Math.sin(n * 127.1 + 31.7) * 43758.5453;
  return value - Math.floor(value);
};
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
export type ParticleTransition = {
  elapsed: number;
  from: Point[];
  scattered: Point[];
  to: Point[];
};

export function createTransition(
  from: Point[],
  to: Point[],
): ParticleTransition {
  return {
    elapsed: 0,
    from: from.map((point) => ({ ...point })),
    to,
    scattered: from.map((point, index) => {
      const angle =
        Math.atan2(point.y, point.x) + 0.35 + randomFor(index + 5) * 0.65;
      const radius = 0.45 + randomFor(index + 71) * 0.69;
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        z: (randomFor(index + 123) - 0.5) * 0.85,
        size: point.size * 0.82,
      };
    }),
  };
}

// A timed two-stage journey: loosen the old symbol, then settle into the new one.
// Sampling the current positions when interrupted avoids snapping on quick tab changes.
export function advanceTransition(
  transition: ParticleTransition,
  points: Point[],
  delta: number,
): boolean {
  transition.elapsed = Math.min(
    MORPH_DURATION,
    transition.elapsed + Math.max(0, delta),
  );
  const finished = transition.elapsed >= MORPH_DURATION;
  points.forEach((point, index) => {
    const delay = randomFor(index + 311) * 0.08;
    const time = transition.elapsed / MORPH_DURATION - delay;
    const assembling = time >= 0.32;
    const from = assembling
      ? transition.scattered[index]
      : transition.from[index];
    const to = assembling ? transition.to[index] : transition.scattered[index];
    const mix = smooth(assembling ? (time - 0.32) / 0.6 : time / 0.32);
    for (const axis of ['x', 'y', 'z', 'size'] as const) {
      point[axis] = finished
        ? transition.to[index][axis]
        : from[axis] + (to[axis] - from[axis]) * mix;
    }
  });
  return finished;
}

// Small coherent waves keep every settled symbol alive without obscuring its outline.
// These offsets never change the underlying geometry used by the next morph.
export function livingPoint(point: Point, index: number, time: number): Point {
  const phase = index * 2.39996;
  return {
    x:
      point.x +
      Math.sin(time * 1.05 + point.y * 2.4) * 0.014 +
      Math.sin(time * 0.8 + phase) * 0.005,
    y:
      point.y +
      Math.cos(time * 0.9 + point.x * 2.1) * 0.016 +
      Math.cos(time * 0.7 + phase) * 0.005,
    z: point.z + Math.sin(time * 0.85 + phase) * 0.025,
    size: point.size,
  };
}
