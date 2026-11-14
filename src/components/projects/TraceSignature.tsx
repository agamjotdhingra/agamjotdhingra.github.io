import React, { useMemo, useRef } from 'react';
import { EngineeringDomain } from '@/types';
import { useInView } from '@/components/motion/useReducedMotion';

const W = 480;
const H = 220;

/** Small deterministic PRNG so each project always gets the same trace. */
function seeded(seedText: string) {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) {
    h ^= seedText.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPath(domain: EngineeringDomain | undefined, seed: string): string {
  const rnd = seeded(seed);
  const mid = H / 2;
  const pts: string[] = [];

  if (domain === 'electronics') {
    // Digital clock / data line: square wave with varied duty cycle.
    let x = 0;
    let high = false;
    pts.push(`M0 ${mid + 40}`);
    while (x < W) {
      const len = 20 + Math.floor(rnd() * 4) * 14;
      pts.push(`H${Math.min(W, x + len)}`);
      x += len;
      high = !high;
      if (x < W) pts.push(`V${high ? mid - 40 : mid + 40}`);
      
    }
    return pts.join(' ');
  }

  if (domain === 'ai') {
    // Training curve: noisy exponential decay settling toward a floor.
    const floor = mid + 55;
    const top = 30 + rnd() * 20;
    const k = 4 + rnd() * 2;
    for (let x = 0; x <= W; x += 4) {
      const t = x / W;
      const base = floor - (floor - top) * Math.exp(-k * t);
      const noise = (rnd() - 0.5) * 18 * (1 - t * 0.7);
      pts.push(`${x === 0 ? 'M' : 'L'}${x} ${(base + noise).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // Software / default: packets — bursts of high-frequency activity between idle lines.
  const f1 = 0.05 + rnd() * 0.04;
  const f2 = 0.011 + rnd() * 0.01;
  for (let x = 0; x <= W; x += 3) {
    const envelope = Math.max(0, Math.sin(x * f2 + rnd() * 0.15)) ** 2;
    const y = mid + Math.sin(x * f1) * 60 * envelope;
    pts.push(`${x === 0 ? 'M' : 'L'}${x} ${y.toFixed(1)}`);
  }
  return pts.join(' ');
}

const DOMAIN_READOUT: Record<string, { ch: string; label: string }> = {
  electronics: { ch: 'CH1', label: 'Logic · 5V/div' },
  software: { ch: 'CH2', label: 'Requests · burst' },
  ai: { ch: 'CH3', label: 'Loss · epochs' },
};

type TraceSignatureProps = {
  title: string;
  domain?: EngineeringDomain;
  index: number;
};

/**
 * A generative oscilloscope panel unique to each project — gives the card a visual
 * without inventing screenshots. Purely decorative (aria-hidden).
 */
export const TraceSignature: React.FC<TraceSignatureProps> = ({ title, domain, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });
  const d = useMemo(() => buildPath(domain, title), [domain, title]);
  const readout = (domain && DOMAIN_READOUT[domain]) || { ch: 'CH0', label: 'Signal' };
  const gridId = `trace-grid-${index}`;
  const glowId = `trace-glow-${index}`;

  return (
    <div
      ref={ref}
      data-in={inView ? '' : undefined}
      className="relative overflow-hidden rounded-xl border border-[#1c1e24] bg-[#0b0c0e]"
      aria-hidden="true"
    >
      <div className="flex items-center justify-between border-b border-[#1c1e24] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(244,183,64,0.8)]" />
          {readout.ch}
        </span>
        <span>{readout.label}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" preserveAspectRatio="none">
        <defs>
          <pattern id={gridId} width="40" height="22" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V22" fill="none" stroke="#1a1c22" strokeWidth="1" />
          </pattern>
          <filter id={glowId} x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
        <rect width={W} height={H} fill={`url(#${gridId})`} />
        <line x1="0" x2={W} y1={H / 2} y2={H / 2} stroke="#23252c" strokeDasharray="2 4" />
        <g style={{ '--trace-length': 1000 } as React.CSSProperties}>
          <path d={d} pathLength={1000} className="trace-path" fill="none" stroke="#f4b740" strokeOpacity="0.45" strokeWidth="4" filter={`url(#${glowId})`} />
          <path d={d} pathLength={1000} className="trace-path" fill="none" stroke="#f4b740" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      </svg>
      {/* Scanline sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.012)_50%)] bg-[length:100%_3px]" />
    </div>
  );
};
