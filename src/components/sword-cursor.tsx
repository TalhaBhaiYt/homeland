'use client';

import { useEffect, useState } from 'react';

export default function SwordCursor() {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 200);
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const cursorUrl = isClicked ? '/cursor-enchanted.svg' : '/cursor-normal.svg';
    document.body.style.cursor = `url('${cursorUrl}'), auto`;

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [isClicked]);

  return null;
}
