interface ButtonProps{
    text: string;
    isLoading?: boolean;
    onClick?: ()=>void;
    disabled?: boolean;

}

export function Button({ text, isLoading, onClick, disabled }: ButtonProps){
    return (
          <button onClick={onClick} disabled={disabled} className="bg-black text-zinc-50 px-4 py-3 rounded-md w-fit mt-4 disabled:opacity-50 cursor-pointer" type="submit">
          {isLoading ? "Loading..." : text}
          </button>

    )

}