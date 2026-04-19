"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  id: string;
  emoji: string;
  leftPct: number;
  delayS: number;
  startTopPct: number;
  stopTopPct: number;
  driftPx: number;
};

function hashStr(s: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h >>> 0);
}

function rnd01(seed: string, i: number): number {
  return (hashStr(`${seed}|${i}`, i) % 10000) / 10000;
}

type Props = {
  emojis: string[];
  /** Stable layout per product (e.g. product.handle). */
  seed: string;
  /** When false, no emoji rain until the PDP info card is in the viewport (e.g. after scroll on phone). */
  active?: boolean;
};

const PARTICLE_MIN = 28;
const PARTICLE_RANGE = 8; /* 28–35 */

export function PdpEmojiRain({ emojis, seed, active = true }: Props) {
  const reduceMotion = useReducedMotion();
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    if (!active) {
      setClientReady(false);
      return;
    }
    setClientReady(true);
  }, [active]);

  const particles = useMemo((): Particle[] => {
    const base = emojis.length ? emojis : ["✨"];
    const pool = [...base, ...base, ...base, ...base];
    const n = PARTICLE_MIN + (hashStr(seed, 0) % PARTICLE_RANGE);
    const out: Particle[] = [];
    for (let i = 0; i < n; i++) {
      const u1 = rnd01(seed, i * 3 + 1);
      const u2 = rnd01(seed, i * 3 + 2);
      const u3 = rnd01(seed, i * 3 + 3);
      const u4 = rnd01(seed, i * 3 + 4);
      /* Golden-ratio horizontal spread avoids clumping */
      const gx = ((i * 0.618033988749895) % 1) * 0.88 + 0.06;
      const leftPct = Math.min(96, Math.max(2, gx * 100 + (u1 - 0.5) * 8));
      /* Stagger vertical start: not a single horizontal band */
      const startTopPct = -22 + u2 * 28;
      /* Land near bottom of card (Shipping / Returns zone) */
      const stopTopPct = 76 + u3 * 14;
      const driftPx = Math.round((u4 - 0.5) * 40);
      const delayS = (i % 9) * 0.04;
      out.push({
        id: `${seed}-${i}`,
        emoji: pool[i % pool.length]!,
        leftPct,
        delayS,
        startTopPct,
        stopTopPct,
        driftPx,
      });
    }
    return out;
  }, [emojis, seed]);

  if (!active) {
    return null;
  }

  if (reduceMotion) {
    const base = emojis.length ? emojis : ["✨"];
    const pool = [...base, ...base, ...base, ...base];
    return (
      <div
        className="pointer-events-none mb-2 flex flex-wrap justify-center gap-2 text-2xl opacity-70"
        aria-hidden
      >
        {pool.slice(0, 12).map((e, i) => (
          <span key={`${e}-${i}`}>{e}</span>
        ))}
      </div>
    );
  }

  if (!clientReady) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      {particles.map((p) => (
        <span
          key={p.id}
          className="pdp-emoji-particle absolute leading-none will-change-transform"
          style={
            {
              left: `${p.leftPct}%`,
              ["--pdp-start-top" as string]: `${p.startTopPct}%`,
              ["--pdp-stop-top" as string]: `${p.stopTopPct}%`,
              ["--pdp-drift" as string]: `${p.driftPx}px`,
              ["--pdp-fall-delay" as string]: `${p.delayS}s`,
            } as React.CSSProperties
          }
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
