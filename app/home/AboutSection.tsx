'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import CanvasDraw from "react-canvas-draw";

export default function AboutSection() {
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  
  useEffect(() => {
    setCanvasSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);
  
  // Track scroll progress relative to the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Transform scroll to scale from 400px to full viewport
  const width = useTransform(scrollYProgress, [0, 1], ["20vw", "100vw"]);
  const height = useTransform(scrollYProgress, [0, 1], ["40vh", "100vh"]);

  return (
    <>
      {/* Spacer to allow scrolling */}
      <div className="h-[300vh]" ref={containerRef}>
        <div className="sticky top-0 flex h-screen items-center justify-center bg-black overflow-hidden">

          <motion.div
            style={{
              width,
              height,
            }}
            className="flex items-center justify-center relative bg-white p-4 overflow-hidden"
          >
          <p className='absolute top-0 left-0 z-100 text-sm font-mono text-gray-500 p-4' >01 - ABOUT</p>

            <div className='absolute inset-0 z-0'>
             <CanvasDraw
              canvasWidth={canvasSize.width}
              canvasHeight={canvasSize.height}
              brushRadius={6}
              hideInterface
              brushColor="#000"
            />
            </div>
            <div className='absolute z-10'>
              {/* <p className='absolute top-0 left-0 text-sm font-mono text-gray-500 p-4' >01 - ABOUT</p> */}
              <h2 className="text-3xl font-semibold text-black text-center">
                I code because I can't draw 
              </h2>
              <p className='text-center text-zinc-500'>[draw something to continue]</p>

            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}