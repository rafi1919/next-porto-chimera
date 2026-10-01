import Image from "next/image";



export default function Profile() {
    return (
        <Image
            src="/icon/anonymous.webp"
            alt=""
            width={100}
            height={100}
            className="size-12 shrink-0 rounded-full border-2 border-white object-cover"
        />
    );
}