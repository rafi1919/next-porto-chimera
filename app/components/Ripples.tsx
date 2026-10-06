"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Ripple = { x: number; y: number; r: number; a: number };

type Props = {
    /** px the pointer must travel before the next ripple spawns */
    spacing?: number;
    /** max radius of a ripple in px */
    maxRadius?: number;
    /** concentric rings per ripple */
    rings?: number;
    /** seconds a ripple lives */
    duration?: number;
};

/**
 * Drop inside a `relative` parent. It listens on the parent,
 * so the canvas itself never blocks clicks or text selection.
 * Ring color follows the parent's CSS `color`, so dark mode just works.
 */
export default function Ripples({
    spacing = 32,
    maxRadius = 170,
    rings = 3,
    duration = 1.9,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const parent = canvas?.parentElement;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !parent || !ctx) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ripples: Ripple[] = [];
        let w = 0;
        let h = 0;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const b = parent.getBoundingClientRect();
            w = b.width;
            h = b.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        const ro = new ResizeObserver(resize);
        ro.observe(parent);
        resize();

        const spawn = (x: number, y: number, strength = 1) => {
            if (ripples.length > 40) {
                const old = ripples.shift()!;
                gsap.killTweensOf(old);
            }
            const rp: Ripple = { x, y, r: 0, a: 0.45 * strength };
            ripples.push(rp);
            gsap.to(rp, {
                r: maxRadius * strength,
                a: 0,
                duration,
                ease: "power2.out",
                onComplete: () => {
                    const i = ripples.indexOf(rp);
                    if (i > -1) ripples.splice(i, 1);
                },
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            if (!ripples.length) return;

            ctx.strokeStyle = getComputedStyle(parent).color;
            const gap = maxRadius / 7;

            for (const rp of ripples) {
                for (let k = 0; k < rings; k++) {
                    const radius = rp.r - k * gap;
                    if (radius <= 0) continue;
                    // outer ring is strongest, inner rings fade out like real wave trains
                    ctx.globalAlpha = Math.max(rp.a * (1 - k / rings), 0);
                    ctx.lineWidth = 1.6 - k * 0.4;
                    ctx.beginPath();
                    ctx.arc(rp.x, rp.y, radius, 0, Math.PI * 2);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
        };
        gsap.ticker.add(draw);

        let lastX = -9999;
        let lastY = -9999;

        const local = (e: PointerEvent) => {
            const b = parent.getBoundingClientRect();
            return { x: e.clientX - b.left, y: e.clientY - b.top };
        };

        const onMove = (e: PointerEvent) => {
            const { x, y } = local(e);
            if (Math.hypot(x - lastX, y - lastY) < spacing) return;
            lastX = x;
            lastY = y;
            spawn(x, y, 0.7);
        };

        const onDown = (e: PointerEvent) => {
            const { x, y } = local(e);
            lastX = x;
            lastY = y;
            spawn(x, y, 1.2); // a tap makes a bigger drop
        };

        parent.addEventListener("pointermove", onMove);
        parent.addEventListener("pointerdown", onDown);

        return () => {
            parent.removeEventListener("pointermove", onMove);
            parent.removeEventListener("pointerdown", onDown);
            gsap.ticker.remove(draw);
            ripples.forEach((r) => gsap.killTweensOf(r));
            ro.disconnect();
        };
    }, [spacing, maxRadius, rings, duration]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full"
        />
    );
}