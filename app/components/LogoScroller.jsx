"use client";

import { useMemo, useState, useEffect } from "react";

// Native port of the Calibre "LogoScroller" Framer component.
// Seamless dual-track marquee. The band has a FIXED, responsive height and
// vertically centers + clips its content. Each logo reserves its exact box via
// `aspectRatio` so the track width never shifts as images load (no speed jumps).
// On phones the set is thinned to `mobileCount` so the animated layer stays
// small enough that mobile Safari won't drop it mid-scroll.
export default function LogoScroller({
  logos = [],
  logoHeight = 24,
  mobileHeight = 19,
  rowRatio = 1.6,
  gap = 36,
  mobileGap = 26,
  durationSeconds = 64,
  mobileDurationSeconds = 30,
  reps = 1,
  mobileCount = 12,
  pauseOnHover = true,
  restingOpacity = 0.55,
  hoverOpacity = 1,
  grayscale = true,
}) {
  const uid = useMemo(() => "ls-" + Math.random().toString(36).slice(2, 9), []);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const apply = () => setMobile(mq.matches);
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  if (!logos.length) return null;

  const sample = (arr, n) => {
    if (arr.length <= n) return arr;
    const step = arr.length / n;
    return Array.from({ length: n }, (_, i) => arr[Math.floor(i * step)]);
  };
  const shown = mobile ? sample(logos, mobileCount) : logos;
  const trackItems = Array.from({ length: Math.max(1, reps) }, () => shown).flat();
  const dur = mobile ? mobileDurationSeconds : durationSeconds;

  const renderLogo = (logo, i) => (
    <span key={i} className={`${uid}__cell`}>
      <img
        src={logo.s}
        alt={logo.n || ""}
        draggable={false}
        decoding="async"
        className={`${uid}__logo`}
        style={{
          height: `calc(var(--lh) * ${typeof logo.scale === "number" ? logo.scale : 1})`,
          aspectRatio: typeof logo.ar === "number" ? String(logo.ar) : undefined,
          transform: typeof logo.dy === "number" ? `translateY(${logo.dy}px)` : undefined,
        }}
      />
    </span>
  );

  return (
    <div className={`${uid}__band`}>
      <style>{`
        .${uid}__band {
          --lh: ${logoHeight}px;
          --row: calc(var(--lh) * ${rowRatio});
          --gap: ${gap}px;
          position: relative; width: 100%; height: var(--row);
          overflow: hidden; display: flex; align-items: center;
        }
        @media (max-width: 640px) {
          .${uid}__band { --lh: ${mobileHeight}px; --gap: ${mobileGap}px; }
        }
        @keyframes ${uid}__scroll { from { transform: translate3d(0,0,0); } to { transform: translate3d(-50%,0,0); } }
        .${uid}__inner { display: flex; width: max-content; animation: ${uid}__scroll ${dur}s linear infinite; }
        .${uid}__track { display: flex; align-items: center; gap: var(--gap); padding-right: var(--gap); flex-shrink: 0; }
        .${uid}__cell { display: inline-flex; align-items: center; flex: 0 0 auto; }
        .${uid}__logo {
          width: auto; max-width: none; display: block; object-fit: contain;
          filter: ${grayscale ? "brightness(0)" : "none"};
          opacity: ${restingOpacity}; transition: opacity 240ms ease; user-select: none;
        }
        ${pauseOnHover ? `.${uid}__band:hover .${uid}__inner { animation-play-state: paused; }` : ""}
        .${uid}__logo:hover { opacity: ${hoverOpacity}; }
        @media (prefers-reduced-motion: reduce) { .${uid}__inner { animation: none; } }
      `}</style>
      <div className={`${uid}__inner`}>
        <div className={`${uid}__track`}>{trackItems.map(renderLogo)}</div>
        <div className={`${uid}__track`} aria-hidden="true">{trackItems.map((l, i) => renderLogo(l, i + trackItems.length))}</div>
      </div>
    </div>
  );
}
