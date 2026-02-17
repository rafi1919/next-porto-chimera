import {Icon }from "@iconify/react"
import { Porto } from "../home/hook/HomeType"
import Image from "next/image"


export default function ProjectCard({id, title, description, image, link, role, stack = [],}:Porto) {
    return (
        <div className="border-t-2 flex gap-4 border-zinc-50 border-solid w-full h-[50vh] pt-4 bg-black">  
            <div className="w-1/2 h-full">
            {image ?
                <Image unoptimized src={image} alt={title} width={100} height={100}  className="w-full h-full object-cover"/>:
                <div className="w-full h-full bg-[#171717] flex items-center justify-center text-zinc-50">
                    <p>No image available</p>
                </div>
            }

            </div>
            <div className="w-1/2 h-full relative">
                <div className="flex justify-start items-center gap-2">
                    <span><Icon icon="oui:dot" className="text-[22px]"/></span>
                    <p className="text-zinborder-zinc-50 font-semibold text-[16px]">{title}</p>
                </div>
                <div className="absolute bottom-0 w-full uppercase">
                    <p className="text-[16px] font-medium text-zinborder-zinc-50 pb-4">{description}</p>
                    <div className=" border-solid border-t border-zinc-50 flex items-center justify-start py-2 text-zinborder-zinc-50 font-light text-sm">
                        <p className="w-1/2 ">Role:</p>
                        <p className="">{role}</p>
                    </div>
                    <div className=" border-solid border-t border-zinc-50 flex items-center justify-start py-2 text-zinborder-zinc-50 font-light text-sm">
                        <p className="w-1/2 ">Tech stack:</p>
                         <p className="">
                            {stack.map((item, index)=>(
                                <span key={index} className="pr-2">{item}</span>
                            ))}
                        </p>
                    </div>

                </div>

            </div>
        </div>
    )
}