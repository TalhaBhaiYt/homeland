'use client';

import { useEffect, useRef } from 'react';

const NORMAL_SWORD = '/cursors/netherite-sword.png';
const ENCHANTED_FRAMES = [
  '/cursors/enchanted-frame-0.png',
  '/cursors/enchanted-frame-1.png',
  '/cursors/enchanted-frame-2.png',
  '/cursors/enchanted-frame-3.png',
  '/cursors/enchanted-frame-4.png',
  '/cursors/enchanted-frame-5.png',
  '/cursors/enchanted-frame-6.png',
];

const FRAME_INTERVAL_MS = 110; // ~9 FPS matching the 7 jiffies in the .ani file

export default function SwordCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const normalImgRef = useRef<HTMLImageElement>(null);
  const enchantedImgRef = useRef<HTMLImageElement>(null);

  const isClickedRef = useRef(false);
  const isVisibleRef = useRef(false);
  const frameIndexRef = useRef(0);
  const animTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if device supports fine pointer (mouse / trackpad)
    const finePointer = window.matchMedia('(pointer: fine)');
    if (!finePointer.matches) return;

    // Preload all cursor frames for instantaneous rendering
    const preloadList = [NORMAL_SWORD, ...ENCHANTED_FRAMES];
    preloadList.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Inject cursor: none for fine pointer devices
    const styleId = 'minecraft-sword-cursor-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        @media (pointer: fine) {
          html, html *, html *::before, html *::after {
            cursor: none !important;
          }
          input, textarea {
            caret-color: #ed3657 !important;
          }
        }
      `;
      document.head.appendChild(styleEl);
    }

    const cursor = cursorRef.current;
    const normalImg = normalImgRef.current;
    const enchantedImg = enchantedImgRef.current;
    if (!cursor || !normalImg || !enchantedImg) return;

    const updatePosition = (x: number, y: number) => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const showCursor = () => {
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        cursor.style.opacity = '1';
      }
    };

    const hideCursor = () => {
      isVisibleRef.current = false;
      cursor.style.opacity = '0';
    };

    const startEnchantedAnimation = () => {
      if (animTimerRef.current) clearInterval(animTimerRef.current);
      frameIndexRef.current = 0;
      enchantedImg.src = ENCHANTED_FRAMES[0];

      animTimerRef.current = setInterval(() => {
        frameIndexRef.current = (frameIndexRef.current + 1) % ENCHANTED_FRAMES.length;
        enchantedImg.src = ENCHANTED_FRAMES[frameIndexRef.current];
      }, FRAME_INTERVAL_MS);
    };

    const stopEnchantedAnimation = () => {
      if (animTimerRef.current) {
        clearInterval(animTimerRef.current);
        animTimerRef.current = null;
      }
      frameIndexRef.current = 0;
    };

    const setClicked = (clicked: boolean) => {
      if (isClickedRef.current === clicked) return;
      isClickedRef.current = clicked;

      if (clicked) {
        normalImg.style.display = 'none';
        enchantedImg.style.display = 'block';
        startEnchantedAnimation();
      } else {
        stopEnchantedAnimation();
        enchantedImg.style.display = 'none';
        normalImg.style.display = 'block';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      showCursor();
      updatePosition(e.clientX, e.clientY);
    };

    const handleMouseDown = () => {
      setClicked(true);
    };

    const handleMouseUp = () => {
      setClicked(false);
    };

    const handleMouseEnter = () => {
      showCursor();
    };

    const handleMouseLeave = () => {
      hideCursor();
      setClicked(false);
    };

    const handleBlur = () => {
      hideCursor();
      setClicked(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('blur', handleBlur);
      stopEnchantedAnimation();
      document.getElementById(styleId)?.remove();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 36,
        height: 36,
        pointerEvents: 'none',
        zIndex: 9999999,
        opacity: 0,
        transition: 'opacity 0.15s ease',
        transformOrigin: '0 0',
        willChange: 'transform',
      }}
    >
      {/* Normal Netherite Sword (default state) */}
      <img
        ref={normalImgRef}
        src={NORMAL_SWORD}
        alt=""
        width={36}
        height={36}
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          userSelect: 'none',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
        }}
      />

      {/* Enchanted Netherite Sword (active/clicked state with animation) */}
      <img
        ref={enchantedImgRef}
        src={ENCHANTED_FRAMES[0]}
        alt=""
        width={36}
        height={36}
        draggable={false}
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          imageRendering: 'pixelated',
          userSelect: 'none',
          pointerEvents: 'none',
          filter: 'drop-shadow(0 0 7px rgba(192, 132, 252, 0.85)) drop-shadow(0 2px 5px rgba(0,0,0,0.6))',
          transform: 'scale(1.05)',
        }}
      />
    </div>
  );
}
