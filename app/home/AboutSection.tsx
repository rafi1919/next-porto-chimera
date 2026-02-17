'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useCallback, useEffect } from 'react';

export default function AboutSection() {
  const containerRef = useRef(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    };
  };

  const handleStart = useCallback((e: MouseEvent | TouchEvent) => {
    isDrawing.current = true;
    lastPos.current = getPos(e);
  }, []);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const pos = getPos(e);
    if (!ctx || !pos || !lastPos.current) return;
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    lastPos.current = pos;
  }, []);

  const handleEnd = useCallback(() => {
    isDrawing.current = false;
    lastPos.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const data = canvas.toDataURL();
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0);
        img.src = data;
      }
    };
    resize();

    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);
    canvas.addEventListener('touchstart', handleStart, { passive: true });
    canvas.addEventListener('touchmove', handleMove, { passive: true });
    canvas.addEventListener('touchend', handleEnd);
    window.addEventListener('resize', resize);

    return () => {
      canvas.removeEventListener('mousedown', handleStart);
      canvas.removeEventListener('mousemove', handleMove);
      canvas.removeEventListener('mouseup', handleEnd);
      canvas.removeEventListener('mouseleave', handleEnd);
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
      window.removeEventListener('resize', resize);
    };
  }, [handleStart, handleMove, handleEnd]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const width = useTransform(scrollYProgress, [0, 1], ["20vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 1], ["40vh", "100vh"]);

  return (
    <>
      <div className="h-[300vh]" ref={containerRef}>
        <div className="sticky top-0 flex h-screen items-center justify-center bg-black overflow-hidden">
          <motion.div
            style={{ width, height }}
            className="flex items-center justify-center relative bg-white p-4 overflow-hidden"
          >
            <p className='absolute top-0 left-0 z-100 text-sm font-mono text-gray-500 p-4'>01 - ABOUT</p>
            <canvas ref={canvasRef} className='absolute inset-0 z-0 w-full h-full cursor-crosshair' />
            <div className='absolute z-10 pointer-events-none'>
              <h2 className="text-3xl font-semibold text-black text-center">
                I code because I can&apos;t draw
              </h2>
              <p className='text-center text-zinc-500'>[draw something to continue]</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}