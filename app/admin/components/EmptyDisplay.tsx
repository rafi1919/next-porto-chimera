import Image from "next/image";
import noDataImage from "@/public/no-data.svg";

interface EmptyDisplayProps {
    imagePath: string;
    title: string;
    message: string;
}

export default function EmptyDisplay({ message, title, imagePath }: EmptyDisplayProps) {

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-2 text-center">
        <Image src={imagePath || noDataImage} alt="No data"  width={300} height={300}/>
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-500 text-lg">{message}</p>
        </div>
    )

}