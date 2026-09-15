'use client';

/**
 * HOMELAND — HouseCursor v4
 *
 * A tiny colorful house that IS the cursor.
 *
 * House colors — FIXED forever:
 *   Roof       → crimson red (#c0392b)
 *   Walls      → off-white cream (#f0ede8)
 *   Door       → dark walnut (#2c1a0e)
 *   Window frames → charcoal (#1a1a1a)
 *   Chimney    → brick red (#8b3a2a)
 *   Base       → dark charcoal (#1c1c1c)
 *
 * Window light — changes on press:
 *   Left click  → warm yellow  (#ffe066 glow)
 *   Right click → cool cyan    (#40e0d0 glow)
 *   Released    → dark / off
 *
 * All state mutations are direct DOM ref writes — zero React re-renders on move.
 * cursor:none injected as a real <style> tag (never scoped by CSS Modules).
 */

import { useEffect, useRef } from 'react';

const W = 38;
const H = 46;
// Hot-spot: roof tip = (19, 0) — the natural "point" of a house shape
const OFF_X = 19;
const OFF_Y = 0;

/* ── Light presets ──────────────────────────────────────────── */
const LIGHT = {
  off:    { win: '#18120e', stroke: '#2a1e18', glow: 'transparent', glowOp: 0, spillOp: 0 },
  yellow: { win: '#ffe680', stroke: '#c8a800', glow: '#ffe066',     glowOp: 0.72, spillOp: 0.30 },
  cyan:   { win: '#80f0ec', stroke: '#009e97', glow: '#40e0d0',     glowOp: 0.68, spillOp: 0.26 },
} as const;

type LightMode = keyof typeof LIGHT;

export default function HouseCursor() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const svgRef     = useRef<SVGSVGElement>(null);
  const winLRef    = useRef<SVGRectElement>(null);
  const winRRef    = useRef<SVGRectElement>(null);
  const glowLRef   = useRef<SVGRectElement>(null);
  const glowRRef   = useRef<SVGRectElement>(null);
  const spillLRef  = useRef<SVGRectElement>(null);
  const spillRRef  = useRef<SVGRectElement>(null);

  useEffect(() => {
    const fine    = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches) return;

    /* ── cursor: none via real <style> tag ─────────────────── */
    const styleEl = document.createElement('style');
    styleEl.id = 'hl-cursor-none';
    styleEl.textContent =
      'html,html *,html *::before,html *::after{cursor:none!important}' +
      'html input,html textarea{caret-color:#c0392b}';
    document.head.appendChild(styleEl);

    /* ── rAF position loop ──────────────────────────────────── */
    let tx = -300, ty = -300, cx = -300, cy = -300, raf = 0;
    const LERP = reduced.matches ? 1 : 0.19;
    const wrap = wrapRef.current!;

    function loop() {
      cx += (tx - cx) * LERP;
      cy += (ty - cy) * LERP;
      wrap.style.transform = `translate3d(${cx - OFF_X}px,${cy - OFF_Y}px,0)`;
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    /* ── Apply light state ──────────────────────────────────── */
    function applyLight(mode: LightMode) {
      const p = LIGHT[mode];
      const svg = svgRef.current;
      if (!svg) return;

      const inT  = reduced.matches ? '0s' : '0.14s';
      const outT = reduced.matches ? '0s' : '0.36s';
      const dur  = mode === 'off' ? outT : inT;
      const ease = 'ease';

      // Windows
      for (const ref of [winLRef.current, winRRef.current]) {
        if (!ref) continue;
        ref.style.transition = `fill ${dur} ${ease}, stroke ${dur} ${ease}`;
        ref.style.fill   = p.win;
        ref.style.stroke = p.stroke;
      }

      // Glow — left full, right slightly softer
      if (glowLRef.current) {
        glowLRef.current.style.transition = `opacity ${dur} ${ease}, fill ${dur} ${ease}`;
        glowLRef.current.style.fill    = p.glow;
        glowLRef.current.style.opacity = String(p.glowOp);
      }
      if (glowRRef.current) {
        glowRRef.current.style.transition = `opacity ${dur} ${ease}, fill ${dur} ${ease}`;
        glowRRef.current.style.fill    = p.glow;
        glowRRef.current.style.opacity = String(p.glowOp * 0.78);
      }

      // Spill
      if (spillLRef.current) {
        spillLRef.current.style.transition = `opacity ${dur} ${ease}`;
        spillLRef.current.style.fill    = p.glow;
        spillLRef.current.style.opacity = String(p.spillOp);
      }
      if (spillRRef.current) {
        spillRRef.current.style.transition = `opacity ${dur} ${ease}`;
        spillRRef.current.style.fill    = p.glow;
        spillRRef.current.style.opacity = String(p.spillOp * 0.7);
      }

      // Drop-shadow + press scale
      const shadow = mode === 'off'
        ? 'drop-shadow(0 2px 5px rgba(0,0,0,0.5))'
        : `drop-shadow(0 0 7px ${p.glow}88) drop-shadow(0 3px 7px rgba(0,0,0,0.55))`;
      const scale = mode === 'off' ? 'scale(1)' : 'scale(0.93)';
      svg.style.transition = `filter ${dur} ${ease}, transform ${mode === 'off' ? '0.22s' : '0.1s'} cubic-bezier(0.22,1,0.36,1)`;
      svg.style.filter     = shadow;
      svg.style.transform  = scale;
    }

    /* ── Pointer events ─────────────────────────────────────── */
    function onMove(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      tx = e.clientX;
      ty = e.clientY;
      wrap.style.opacity = '1';
    }

    function onDown(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      if (e.button === 0) applyLight('yellow');
      if (e.button === 2) applyLight('cyan');
    }

    function onUp(e: PointerEvent) {
      if (e.pointerType === 'touch') return;
      if (e.button === 0 || e.button === 2) applyLight('off');
    }

    function onCancel() { applyLight('off'); }
    function onBlur()   { applyLight('off'); }
    function onLeave()  { wrap.style.opacity = '0'; applyLight('off'); }

    function onContextMenu(e: MouseEvent) { e.preventDefault(); }

    window.addEventListener('pointermove',    onMove,        { passive: true });
    window.addEventListener('pointerdown',    onDown,        { passive: true });
    window.addEventListener('pointerup',      onUp,          { passive: true });
    window.addEventListener('pointercancel',  onCancel,      { passive: true });
    document.addEventListener('pointerleave', onLeave,       { passive: true });
    window.addEventListener('blur',           onBlur);
    window.addEventListener('contextmenu',    onContextMenu);

    return () => {
      cancelAnimationFrame(raf);
      document.getElementById('hl-cursor-none')?.remove();
      window.removeEventListener('pointermove',    onMove);
      window.removeEventListener('pointerdown',    onDown);
      window.removeEventListener('pointerup',      onUp);
      window.removeEventListener('pointercancel',  onCancel);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur',           onBlur);
      window.removeEventListener('contextmenu',    onContextMenu);
    };
  }, []);

  /* ─────────────────────────────────────────────────────────────
     THE HOUSE SVG
     viewBox 0 0 38 46

     Architecture (all coordinates):
       Chimney:      x=25–29,  y=1–11
       Roof:         triangle  18,1 → 37,18 → 1,18
       Roof overhang: 18,1 → 38,19 → 0,19  (slightly wider fascia)
       Walls:        rect 5,19 → 33,19 → 33,45 → 5,45
       Door:         rect 14,31 → 24,45  (centred, bottom flush)
       Left window:  rect 7,22  w=8 h=6.5
       Right window: rect 23,22 w=8 h=6.5
       Base:         rect 4,44 → 34,46

     Hot-spot: roof tip (18,1) → offset by (-19,0) puts pointer there
  ────────────────────────────────────────────────────────────── */
  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        width:         W,
        height:        H,
        pointerEvents: 'none',
        zIndex:        2147483647,
        opacity:       0,
        willChange:    'transform',
      }}
    >
      <svg
        ref={svgRef}
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          display:         'block',
          overflow:        'visible',
          filter:          'drop-shadow(0 2px 5px rgba(0,0,0,0.5))',
          transformOrigin: `${W / 2}px ${H}px`,
        }}
      >
        <defs>
          {/* Bloom filter */}
          <filter id="hc-bloom" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.6" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>

          {/* Roof — crimson gradient, lighter at top */}
          <linearGradient id="hc-roof-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#d63031" />
            <stop offset="100%" stopColor="#922b21" />
          </linearGradient>

          {/* Wall — off-white cream */}
          <linearGradient id="hc-wall-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f5f0e8" />
            <stop offset="100%" stopColor="#e8e0d0" />
          </linearGradient>
        </defs>

        {/* ── Ground shadow ─────────────────────────────────── */}
        <ellipse cx="19" cy="46" rx="11" ry="1.6"
          fill="rgba(0,0,0,0.28)" />

        {/* ── Base strip ────────────────────────────────────── */}
        <rect x="4" y="43" width="30" height="3" rx="0.5"
          fill="#1c1c1c" />

        {/* ── Chimney (brick red) ───────────────────────────── */}
        <rect x="25" y="2" width="4" height="10" rx="0.5"
          fill="#8b3a2a" stroke="#6b2a1a" strokeWidth="0.6" />
        {/* Chimney cap */}
        <rect x="24" y="1" width="6" height="2.2" rx="0.4"
          fill="#722215" stroke="#5a1a10" strokeWidth="0.5" />
        {/* Chimney mortar lines */}
        <line x1="25" y1="5.5"  x2="29" y2="5.5"  stroke="#6b2a1a" strokeWidth="0.4" opacity="0.6" />
        <line x1="25" y1="8.5"  x2="29" y2="8.5"  stroke="#6b2a1a" strokeWidth="0.4" opacity="0.6" />
        <line x1="27" y1="3"    x2="27" y2="12"    stroke="#6b2a1a" strokeWidth="0.3" opacity="0.4" />

        {/* ── Roof overhang fascia (slightly wider than roof) ── */}
        <polygon
          points="19,1 38,19 0,19"
          fill="#7b1e14"
          stroke="#5a1509"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />

        {/* ── Roof body (crimson) ───────────────────────────── */}
        <polygon
          points="19,1 36,18 2,18"
          fill="url(#hc-roof-g)"
          stroke="#922b21"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        {/* Roof ridge tile — darker stripe at peak */}
        <line x1="19" y1="1" x2="19" y2="8"
          stroke="#7b1e14" strokeWidth="1.4"
          strokeLinecap="round" opacity="0.9" />
        {/* Roof tile lines (subtle texture) */}
        <line x1="19" y1="5"  x2="10" y2="14" stroke="#7b1e14" strokeWidth="0.3" opacity="0.4" />
        <line x1="19" y1="5"  x2="28" y2="14" stroke="#7b1e14" strokeWidth="0.3" opacity="0.4" />
        <line x1="19" y1="9"  x2="6"  y2="17" stroke="#7b1e14" strokeWidth="0.3" opacity="0.3" />
        <line x1="19" y1="9"  x2="32" y2="17" stroke="#7b1e14" strokeWidth="0.3" opacity="0.3" />
        {/* Roof highlight edge */}
        <polygon points="19,1 36,18 2,18"
          fill="none" stroke="#e87070" strokeWidth="0.3" opacity="0.35" />

        {/* ── Walls (cream/off-white) ───────────────────────── */}
        <rect x="5" y="18" width="28" height="26" rx="0.4"
          fill="url(#hc-wall-g)"
          stroke="#c8bfaa" strokeWidth="0.6" />

        {/* Wall shadow under eave */}
        <rect x="5" y="18" width="28" height="3" rx="0"
          fill="rgba(0,0,0,0.07)" />

        {/* ── Left window ───────────────────────────────────── */}
        {/* Outer frame — dark charcoal */}
        <rect x="7" y="22" width="8" height="6.5" rx="0.6"
          fill="#1a1a1a" />
        {/* Inner pane — driven by JS */}
        <rect ref={winLRef}
          x="7.5" y="22.5" width="7" height="5.5" rx="0.4"
          fill="#18120e" stroke="#2a1e18" strokeWidth="0.3"
          style={{ transition: 'fill 0.36s ease, stroke 0.36s ease' }}
        />
        {/* Window muntins (cross bars) */}
        <line x1="11"   y1="22.5" x2="11"   y2="28" stroke="#111" strokeWidth="0.7" />
        <line x1="7.5"  y1="25.3" x2="14.5" y2="25.3" stroke="#111" strokeWidth="0.7" />
        {/* Window sill */}
        <rect x="6.5" y="28" width="9" height="1" rx="0.3"
          fill="#b8aa90" />

        {/* ── Right window ──────────────────────────────────── */}
        <rect x="23" y="22" width="8" height="6.5" rx="0.6"
          fill="#1a1a1a" />
        <rect ref={winRRef}
          x="23.5" y="22.5" width="7" height="5.5" rx="0.4"
          fill="#18120e" stroke="#2a1e18" strokeWidth="0.3"
          style={{ transition: 'fill 0.36s ease, stroke 0.36s ease' }}
        />
        <line x1="27"   y1="22.5" x2="27"   y2="28" stroke="#111" strokeWidth="0.7" />
        <line x1="23.5" y1="25.3" x2="30.5" y2="25.3" stroke="#111" strokeWidth="0.7" />
        <rect x="22.5" y="28" width="9" height="1" rx="0.3"
          fill="#b8aa90" />

        {/* ── Door (dark walnut) ────────────────────────────── */}
        {/* Door surround / frame */}
        <rect x="13.5" y="30" width="11" height="14" rx="0.8"
          fill="#1e1208" stroke="#3a2210" strokeWidth="0.6" />
        {/* Door arch */}
        <path d="M13.5 34 Q19 27.5 24.5 34"
          fill="#221508" stroke="#3a2210" strokeWidth="0.4" />
        {/* Door panels */}
        <rect x="14.2" y="31" width="4.4" height="5" rx="0.4"
          fill="#2a1a0a" stroke="#3e2a12" strokeWidth="0.3" />
        <rect x="19.4" y="31" width="4.4" height="5" rx="0.4"
          fill="#2a1a0a" stroke="#3e2a12" strokeWidth="0.3" />
        <rect x="14.2" y="37" width="9.6" height="5.5" rx="0.4"
          fill="#2a1a0a" stroke="#3e2a12" strokeWidth="0.3" />
        {/* Centre split */}
        <line x1="19" y1="30" x2="19" y2="44"
          stroke="#3e2a12" strokeWidth="0.4" opacity="0.7" />
        {/* Door knob */}
        <circle cx="22.5" cy="38.5" r="0.9" fill="#8b6914" />
        <circle cx="22.5" cy="38.5" r="0.5" fill="#c49a20" opacity="0.7" />
        {/* Door step */}
        <rect x="12" y="43" width="14" height="1.5" rx="0.3"
          fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="0.4" />

        {/* ── Subtle purple accent on corner quoins ─────────── */}
        <rect x="5"  y="18" width="2" height="26" rx="0.2"
          fill="#9b59b6" opacity="0.12" />
        <rect x="31" y="18" width="2" height="26" rx="0.2"
          fill="#9b59b6" opacity="0.12" />

        {/* ── Window bloom glows (opacity + fill via JS) ──────── */}
        <rect ref={glowLRef}
          x="3" y="19" width="14" height="12" rx="3"
          fill="#ffe066" opacity="0"
          filter="url(#hc-bloom)"
          style={{ transition: 'opacity 0.36s ease, fill 0.14s ease' }}
        />
        <rect ref={glowRRef}
          x="19" y="19" width="14" height="12" rx="3"
          fill="#ffe066" opacity="0"
          filter="url(#hc-bloom)"
          style={{ transition: 'opacity 0.36s ease, fill 0.14s ease' }}
        />

        {/* ── Light spill on wall below windows ───────────────── */}
        <rect ref={spillLRef}
          x="6.5" y="28" width="8" height="3.5" rx="1"
          fill="#ffe066" opacity="0"
          style={{ filter: 'blur(1.5px)', transition: 'opacity 0.38s ease, fill 0.14s ease' }}
        />
        <rect ref={spillRRef}
          x="22.5" y="28" width="8" height="3.5" rx="1"
          fill="#ffe066" opacity="0"
          style={{ filter: 'blur(1.5px)', transition: 'opacity 0.38s ease, fill 0.14s ease' }}
        />
      </svg>
    </div>
  );
}
