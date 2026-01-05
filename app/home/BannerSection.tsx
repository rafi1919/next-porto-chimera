'use client';
import Image from "next/image";
export default function BannerSection() {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-zinc-50 font-sans dark:bg-black p-4 gap-6">
       <h1 className="p-4 text-5xl absolute top-0 left-0 font-black leading-10 tracking-tight text-black dark:text-zinc-50 uppercase">
        RAIN <br/>
        OUTSIDE <br/>
        .CO
      </h1>
      <h1 className="max-w-xs text-3xl font-semibold leading-6 tracking-tight text-black dark:text-zinc-50">
        It&apos;s not all about code, it&apos;s about crafting digital experiences that resonate.
      </h1>
    </div>
  );
}
