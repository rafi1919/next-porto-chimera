
type MindCardProps = {
  number: number | string;
  description: string;
  isActive?: boolean;
};

export function MindCard({
  number,
  description,
  isActive = false,
}: MindCardProps) {
  return (
    <div
      className={`
        relative
        w-[150px]
        transition-transform
        duration-300
        ease-out
        motion-reduce:transform-none
        motion-reduce:transition-none
        ${isActive ? "-translate-y-0.75 scale-[1.03]" : ""}
      `}
    >
      {/* Number tab */}
      <div
        className="
          absolute
          -top-[15px]
          left-0
          z-20
          flex
          h-[22px]
          w-[27px]
          items-center
          justify-center
          bg-[#f2f2f2]
          font-mono
          text-[11px]
          font-black
          leading-none
          text-black
        "
      >
        {String(number).padStart(2, "0")}
      </div>

      {/* Card */}
      <div
        className={`
          relative
          border
          border-black
          bg-black
          transition-shadow
          duration-300
          ease-out
          ${isActive ? "shadow-[0_0_24px_rgba(186,255,0,.22)]" : "shadow-none"}
        `}
      >
        {/* Header */}
        <div
          className={`
            relative
            flex
            h-[27px]
            items-center
            justify-between
            px-[8px]
            transition-colors
            duration-300
            ease-out ${isActive ? "bg-diamond-600" : "bg-diamond-800"}`
          }
        >
          <span
            className="
              font-mono
              text-[14px]
              font-black
              italic
              leading-none
              tracking-[-1.2px]
              text-black
            "
          >
            MIND
          </span>

          {/* Plus icon — mask so the monochrome SVG takes the bg color */}
          <span
            aria-hidden
            className="
              size-3.25
              shrink-0
              bg-black
              [mask:url(/icon/hud-plus-square.svg)_center/contain_no-repeat]
            "
          />

          {/* tiny corner cut */}
          <div
            className="
              absolute
              bottom-0
              right-0
              h-[4px]
              w-[4px]
              bg-black
            "
          />
        </div>

        {/* Description */}
        <div className="px-[8px] py-[7px]">
          <p
            className="
              font-mono
              text-[10px]
              font-bold
              leading-[1.2]
              tracking-[-0.2px]
              text-white
            "
          >
            "{description}"
          </p>
        </div>
      </div>
    </div>
  );
}