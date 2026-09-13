'use client';
import { useEffect, useRef, useState } from 'react';
import { Database, ShieldCheck, ChartColumnIncreasing } from 'lucide-react';
import {
  createTransition,
  advanceTransition,
  livingPoint,
  randomFor as rand,
  type Point,
  type ParticleTransition,
} from './particle-motion';

const COUNT = 1152;
export type Discipline = 'data' | 'bi' | 'privacy';
function chartPoint(index: number): Point {
  const bar = index % 8;
  const n = Math.floor(index / 8);
  const h = [0.38, 0.61, 0.43, 0.83, 0.68, 1.04, 0.86, 1.22][bar];
  return {
    x: (bar - 3.5) * 0.29,
    y: 0.64 - (n / 144) * h * 1.38,
    z: (rand(index) - 0.5) * 0.52,
    size: 1.35,
  };
}

// Sample the installed Lucide symbols instead of inventing abstract outlines.
// Three shallow depth layers retain the recognisable database and shield faces.
function symbolPoints(root: HTMLElement, mode: string): Point[] {
  const icon = root.querySelector(`[data-particle-icon="${mode}"]`);
  const paths = Array.from(
    icon?.querySelectorAll<SVGGeometryElement>(
      'path,ellipse,circle,line,polyline,polygon',
    ) ?? [],
  )
    .map((path) => ({ path, length: path.getTotalLength() }))
    .filter((entry) => entry.length > 0);
  const total = paths.reduce((sum, entry) => sum + entry.length, 0);
  if (!total) throw new Error('Particle symbol has no geometry');
  return Array.from({ length: COUNT }, (_, index) => {
    let distance = (Math.floor(index / 3) / (COUNT / 3)) * total;
    let entry = paths[paths.length - 1];
    for (const candidate of paths) {
      entry = candidate;
      if (distance <= candidate.length) break;
      distance -= candidate.length;
    }
    const p = entry.path.getPointAtLength(Math.min(distance, entry.length));
    return {
      x: (p.x - 12) / 11,
      y: (p.y - 12) / 11,
      z: ((index % 3) - 1) * 0.095,
      size: index % 3 === 1 ? 1.65 : 1.05,
    };
  });
}

export default function DataSculpture({
  mode,
  paused,
}: {
  mode: Discipline;
  paused: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const symbolsRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const modeRef = useRef(mode);
  const pauseRef = useRef(paused);
  const wakeRef = useRef<() => void>(() => {});
  useEffect(() => {
    modeRef.current = mode;
    wakeRef.current();
  }, [mode]);
  useEffect(() => {
    pauseRef.current = paused;
    wakeRef.current();
  }, [paused]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const symbols = symbolsRef.current;
    if (!canvas || !symbols) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let targets: Record<Discipline, Point[]>;
    try {
      targets = {
        data: symbolPoints(symbols, 'data'),
        privacy: symbolPoints(symbols, 'privacy'),
        bi: Array.from({ length: COUNT }, (_, i) => chartPoint(i)),
      };
    } catch {
      return; // The matching vector symbol remains visible if sampling is unavailable.
    }
    let width = 600,
      height = 540,
      active = true,
      frame = 0,
      t = 0,
      last = 0;
    let px = 0,
      py = 0,
      easeX = 0,
      easeY = 0,
      lastMode = '';
    const points = targets[modeRef.current].map((point) => ({ ...point }));
    let targetMode = modeRef.current;
    let transition: ParticleTransition | null = null;
    let hasDrawn = false;
    const wake = () => {
      if (!frame && active && !document.hidden) {
        last = 0;
        frame = requestAnimationFrame(render);
      }
    };
    wakeRef.current = wake;
    const palette = getComputedStyle(canvas);
    const particleColor =
      palette.getPropertyValue('--particle-rgb').trim() || '111,159,255';
    const highlightColor =
      palette.getPropertyValue('--particle-highlight-rgb').trim() ||
      '222,180,110';
    let rotation = -0.08,
      tilt = -0.08;
    const resize = new ResizeObserver((entries) => {
      const { width: w, height: h } = entries[0].contentRect;
      width = w;
      height = h;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastMode = '';
      wake();
    });
    resize.observe(canvas);
    const visibility = new IntersectionObserver(
      (entries) => {
        active = entries[0].isIntersecting;
        wake();
      },
      { rootMargin: '150px' },
    );
    visibility.observe(canvas);
    const pointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || pauseRef.current) return;
      const rect = canvas.getBoundingClientRect();
      px = Math.max(
        -1,
        Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
      );
      py = Math.max(
        -1,
        Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
      );
    };
    const leave = () => {
      px = 0;
      py = 0;
    };
    canvas.addEventListener('pointermove', pointer);
    canvas.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', wake);
    const render = (now: number) => {
      frame = 0;
      const dt = last ? Math.max(0, (now - last) / 1000) : 0.016;
      last = now;
      if (!active || document.hidden) return;
      const frozen = pauseRef.current;
      const currentMode = modeRef.current;
      if (currentMode !== targetMode) {
        transition = createTransition(points, targets[currentMode]);
        targetMode = currentMode;
      }
      if (frozen && lastMode === currentMode && !transition) return;
      if (frozen) {
        points.forEach((point, index) =>
          Object.assign(point, targets[currentMode][index]),
        );
        transition = null;
      } else if (transition && advanceTransition(transition, points, dt)) {
        transition = null;
      }
      if (!frozen) t += dt;
      const pointerMix = 1 - Math.exp(-dt * 3);
      easeX += (px - easeX) * pointerMix;
      easeY += (py - easeY) * pointerMix;
      const targetRotation =
        (currentMode === 'bi' ? -0.2 : 0) +
        Math.sin(t * 0.55) * 0.045 +
        easeX * 0.1;
      const targetTilt =
        (currentMode === 'bi' ? 0.08 : -0.08) +
        Math.sin(t * 0.4) * 0.025 -
        easeY * 0.08;
      const rotationMix = frozen ? 1 : 1 - Math.exp(-dt * 3.5);
      rotation += (targetRotation - rotation) * rotationMix;
      tilt += (targetTilt - tilt) * rotationMix;
      const scale = Math.min(width, height) * 0.36;
      const ca = Math.cos(rotation),
        sa = Math.sin(rotation),
        cb = Math.cos(tilt),
        sb = Math.sin(tilt);
      ctx.clearRect(0, 0, width, height);
      const projected = points
        .map((p, i) => {
          const live = frozen ? p : livingPoint(p, i, t);
          const x = live.x * ca + live.z * sa,
            z = live.z * ca - live.x * sa;
          const y = live.y * cb - z * sb,
            zz = live.y * sb + z * cb;
          const perspective = 3.6 / (3.6 + zz);
          return {
            x: width / 2 + x * scale * perspective + easeX * 8,
            y: height / 2 + y * scale * perspective + easeY * 6,
            z: zz,
            size: p.size * perspective,
            i,
          };
        })
        .sort((a, b) => b.z - a.z);
      for (const p of projected) {
        const alpha = Math.max(0.22, Math.min(1, 0.64 - p.z * 0.45));
        ctx.fillStyle = `rgba(${p.i % 13 === 0 ? highlightColor : particleColor},${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, p.size), 0, Math.PI * 2);
        ctx.fill();
      }
      lastMode = currentMode;
      if (!hasDrawn) {
        hasDrawn = true;
        setReady(true);
      }
      if (!frozen) frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => {
      wakeRef.current = () => {};
      cancelAnimationFrame(frame);
      resize.disconnect();
      visibility.disconnect();
      canvas.removeEventListener('pointermove', pointer);
      canvas.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', wake);
    };
  }, []);
  const FallbackIcon =
    mode === 'privacy'
      ? ShieldCheck
      : mode === 'bi'
        ? ChartColumnIncreasing
        : Database;
  return (
    <>
      <div ref={symbolsRef} className="particle-symbols" aria-hidden="true">
        <Database data-particle-icon="data" />
        <ShieldCheck data-particle-icon="privacy" />
      </div>
      <canvas ref={canvasRef} className="data-canvas" aria-hidden="true" />
      {!ready && (
        <div className="sculpture-fallback" aria-hidden="true">
          <FallbackIcon strokeWidth={0.7} />
        </div>
      )}
    </>
  );
}
