"use client"

interface ButtonRoundProps {
    onClick?:()=>void;
    text:string
}
export default function ButtonRound({ onClick, text }: ButtonRoundProps){
    return(
        <button onClick={onClick} className="custor-pointer flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]">
            {text}
        </button>
    )
}
