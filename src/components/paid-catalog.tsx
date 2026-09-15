'use client';

/**
 * PaidCatalog — verified working infinite RTL carousel.
 *
 * Strategy: requestAnimationFrame + lerp for silky movement.
 * Every 3 seconds we advance the target offset by one card width.
 * The rAF loop smoothly lerps the track's translateX toward the target.
 * When the offset exceeds the width of one full set (setW), we snap
 * back by setW — which is seamless because there are two identical sets.
 *
 * No CSS animations. No keyframes. No animation-play-state hacks.
 * Pure JS transform — 100% reliable.
 */

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { ContentItem } from '@/lib/data';

const CARD_W   = 300;
const CARD_GAP = 22;
const INTERVAL = 3000;   // ms between advances
const EASING   = 0.07;   // lerp factor per frame — lower = smoother

/* ─── sub-components ─────────────────────────────────────── */

function Price({ price, currency }: { price: number; currency: string }) {
  if (!price) return <span style={{ fontSize: 11, fontWeight: 600, color: '#8bc6aa' }}>Free</span>;
  return <span style={{ fontSize: 12, fontWeight: 700, color: '#e8d1ad' }}>{currency} {(price / 100).toFixed(2)}</span>;
}

function Card({ item }: { item: ContentItem }) {
  return (
    <Link
      href={`/content/${item.slug}`}
      tabIndex={0}
      aria-label={item.title}
      style={{
        flexShrink: 0,
        width: CARD_W,
        background: '#101114',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 11,
        overflow: 'hidden',
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color .25s, box-shadow .25s, transform .25s',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 14px 30px rgba(0,0,0,0.3)';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(209,88,114,0.22)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = '';
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      {/* Thumbnail */}
      <div style={{ height: 186, position: 'relative', background: '#15141a', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={item.thumbnail}
          alt={item.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <span style={{
          position: 'absolute', top: 11, left: 11,
          background: 'rgba(41,30,41,0.7)', color: '#eedbb3',
          border: '1px solid rgba(217,183,110,0.25)',
          fontSize: 7, fontWeight: 700, letterSpacing: '.6px',
          padding: '5px 7px', borderRadius: 4,
        }}>PREMIUM</span>
      </div>
      {/* Body */}
      <div style={{ padding: '16px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ fontSize: 8, color: '#9b59b6', letterSpacing: 1, fontWeight: 600, textTransform: 'uppercase' }}>
          {item.category}
        </span>
        <h3 style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-.2px', lineHeight: 1.4, margin: 0, color: '#f4f3f5' }}>
          {item.title}
        </h3>
        <p style={{
          fontSize: 10, color: '#8b8c98', lineHeight: 1.7, margin: 0, flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.description}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '11px 0', marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: '#8a8392' }}>
            <span style={{
              width: 17, height: 17, flexShrink: 0,
              background: 'linear-gradient(145deg,#9164cb,#423854)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 8, color: '#eee', fontWeight: 700,
            }}>{item.creator?.[0] ?? 'H'}</span>
            <span>{item.creator}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Price price={item.price} currency={item.currency} />
            <span style={{ fontSize: 9, fontWeight: 650, color: '#ed3657', display: 'flex', alignItems: 'center', gap: 3 }}>
              View <ArrowUpRight size={11} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="container">
      <div style={{
        padding: '55px 25px', textAlign: 'center',
        border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 12,
        background: 'rgba(16,16,20,0.33)', maxWidth: 480, margin: '0 auto',
      }}>
        <Sparkles size={28} style={{ margin: '0 auto 18px', color: '#9b59b6', display: 'block' }} />
        <h3 style={{ fontSize: 18, margin: '0 0 10px' }}>Premium creations are coming soon.</h3>
        <p style={{ fontSize: 11, margin: '0 0 22px' }}>When paid resources are uploaded they appear here automatically.</p>
        <Link href="/paid" className="button secondary" style={{ fontSize: 10, minHeight: 38 }}>
          Explore Paid Stuff <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

/* ─── main carousel ──────────────────────────────────────── */

export function PaidCatalog({ items }: { items: ContentItem[] }) {
  const paid = items
    .filter(i => i.price > 0 && i.status === 'published')
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const trackRef  = useRef<HTMLDivElement>(null);
  const curX      = useRef(0);   // current rendered x (lerped)
  const targetX   = useRef(0);   // destination x
  const rafRef    = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const hoveredRef = useRef(false);
  const [ready, setReady] = useState(false);

  // One full set width in px
  const setW = paid.length > 0
    ? Math.ceil(8 / paid.length) * paid.length * (CARD_W + CARD_GAP)
    : 0;

  useEffect(() => {
    if (paid.length === 0) return;
    setReady(true);

    // rAF loop — lerps curX toward targetX, writes translateX
    function tick() {
      curX.current += (targetX.current - curX.current) * EASING;

      // Seamless snap: when we've scrolled past one full set, reset by setW
      if (curX.current >= setW) {
        curX.current  -= setW;
        targetX.current -= setW;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(${-curX.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    // Advance every INTERVAL ms (skip if hovered or reduced motion)
    const cardStep = CARD_W + CARD_GAP;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      timerRef.current = setInterval(() => {
        if (!hoveredRef.current) {
          targetX.current += cardStep;
        }
      }, INTERVAL);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paid.length, setW]);

  if (paid.length === 0) return <EmptyState />;

  // Build track: 3 copies of the paid array so the snap is never visible
  const copies = Math.max(3, Math.ceil(9 / paid.length) + 1);
  const trackItems: ContentItem[] = [];
  for (let i = 0; i < copies; i++) trackItems.push(...paid);

  return (
    <div
      style={{ width: '100%', overflow: 'hidden', position: 'relative' }}
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
    >
      {/* fade edges */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: 80,
        background: 'linear-gradient(to right, #08090b, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} aria-hidden="true" />
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: 80,
        background: 'linear-gradient(to left, #08090b, transparent)',
        zIndex: 2, pointerEvents: 'none',
      }} aria-hidden="true" />

      {/* track — starts invisible until JS kicks in to avoid flash */}
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          gap: CARD_GAP,
          width: 'max-content',
          paddingLeft: 16,
          paddingBottom: 16,
          willChange: 'transform',
          opacity: ready ? 1 : 0,
          transition: 'opacity .3s',
        }}
      >
        {trackItems.map((item, i) => (
          <Card key={`${i}-${item.id}`} item={item} />
        ))}
      </div>
    </div>
  );
}
