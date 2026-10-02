"use client";
import { useState } from "react";

type SciFiToggleProps = {
  number: number | string;
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
};

export function SciFiToggle({
  number,
  defaultOn = false,
  onChange,
}: SciFiToggleProps) {
  const [on, setOn] = useState(defaultOn);

  const handleToggle = () => {
    const next = !on;

    setOn(next);
    onChange?.(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={on}
      className="
        relative
        h-[36px] w-[108px]
        rounded-full
        border border-[#181818]
        bg-[#0c0c0c]
        p-[3px]
        shadow-[inset_0_1px_2px_rgba(255,255,255,.08),inset_0_-2px_4px_rgba(0,0,0,.9),0_2px_4px_rgba(0,0,0,.5)]
        transition-transform
        active:scale-[0.98]
      "
    >
      {/* Outer recessed track */}
      <div
        className="
          absolute
          inset-[3px]
          rounded-full
          border border-[#202020]
          bg-[#101010]
          shadow-[inset_0_2px_4px_rgba(0,0,0,.9)]
        "
      />

      {/* Left mechanical screw */}
      <div
        className="
          absolute
          left-[9px]
          top-1/2
          z-10
          h-[10px]
          w-[10px]
          -translate-y-1/2
          rounded-full
          border border-[#242424]
          bg-[#090909]
          shadow-[inset_1px_1px_2px_rgba(255,255,255,.08)]
        "
      >
        <div
          className="
            absolute
            inset-[3px]
            rounded-full
            bg-[#181818]
          "
        />
      </div>

      {/* Right mechanical screw */}
      <div
        className="
          absolute
          right-[9px]
          top-1/2
          z-10
          h-[10px]
          w-[10px]
          -translate-y-1/2
          rounded-full
          border border-[#242424]
          bg-[#090909]
          shadow-[inset_1px_1px_2px_rgba(255,255,255,.08)]
        "
      >
        <div
          className="
            absolute
            inset-[3px]
            rounded-full
            bg-[#181818]
          "
        />
      </div>

      {/* Moving rocker */}
      <div
        className={`
          absolute
          top-[4px]
          z-20
          h-[28px]
          w-[54px]
          rounded-full
          border border-[#242424]
          bg-[#151515]
          shadow-[inset_0_1px_2px_rgba(255,255,255,.08),inset_0_-3px_5px_rgba(0,0,0,.8),0_2px_3px_rgba(0,0,0,.5)]
          transition-all
          duration-200
          ease-out
          ${on ? "left-[49px]" : "left-[4px]"}
        `}
      >
        {/* Diagonal industrial texture */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
            rounded-full
            opacity-30
            bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_3px,#303030_3px,#303030_4px)]
          "
        />

        {/* Subtle top highlight */}
        <div
          className="
            pointer-events-none
            absolute
            left-[8px]
            right-[8px]
            top-[2px]
            h-[1px]
            rounded-full
            bg-white/[0.08]
          "
        />

        {/* Number + status */}
        <div
          className="
            relative
            flex
            h-full
            flex-col
            items-center
            justify-center
            leading-none
          "
        >
          {/* Number */}
          <span
            className={`
              font-mono
              text-[13px]
              font-black
              italic
              tracking-[-1px]
              transition-all
              duration-200
              ${
                on
                  ? "text-diamond-400 drop-shadow-[0_0_3px_rgba(57,95,192,.45)]"
                  : "text-diamond-800"
              }
            `}
          >
            {String(number).padStart(2, "0")}
          </span>

          {/* Status */}
          <span
            className={`
              mt-[1px]
              font-mono
              text-[5px]
              font-black
              italic
              tracking-[1px]
              transition-colors
              duration-200
              ${on ? "text-diamond-400" : "text-diamond-900"}
            `}
          >
            {on ? "ACTIVE" : "OFF"}
          </span>
        </div>
      </div>
    </button>
  );
}