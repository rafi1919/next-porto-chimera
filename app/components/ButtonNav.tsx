"use client"

interface ButtonNavProps {
    onClick?:()=>void;
    text:string,
    isActive?:boolean,
    className?:string
}
export default function ButtonNav({ onClick, text, isActive , className }: ButtonNavProps){
    const baseClasses = `cursor-pointer flex p-4 text-sm font-light text-sm items-center justify-center rounded-md border hover:border-gray-200 border-solid transition ease-in-out ${isActive ? 'border-yellow-700' : 'border-gray-700'}`;
    return(
        <button onClick={onClick} className={className ? `${baseClasses} ${className}` : baseClasses}>
            {text}
        </button>
    )
}
