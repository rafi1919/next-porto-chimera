import Image from "next/image"
import type {PortoProps} from "../hooks/AdminType"
import noImage from  "@/public/Image-not-found.webp"
import { Icon } from "@iconify/react"

type cardProps = {
    item: PortoProps
    onClick:()=>void
}

export function PortoCard({item, onClick}: cardProps) {

    return(
          <div  className="w-full h-87 relative overflow-hidden rounded-lg cursor-pointer" onClick={onClick }>
                        {item.is_active && 
                            <div className="bg-green-600 w-fit flex gap-2 items-center ml-auto absolute top-2 right-2 px-2 py-1 rounded">
                                <Icon icon="material-symbols:check-circle" className="text-zinc-50 text-[18px]"/>
                                <p className="text-sm">Active</p>
                            </div>
                        
                        }
                        <div className="hover:opacity-100 opacity-0 transition ease-in-out absolute inset-0 flex flex-col justify-end p-6"
                            style={{
                                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.85) 100%)'
                            }}>
                            <p className="text-zinc-50/70 text-sm">{item.role}</p>
                            <p className="text-zinc-50 text-xl font-semibold">{item.title}</p>
                        </div>
                        {/* <Image
                            unoptimized
                            src={item.image}
                            alt="admin dashboard"
                            className="w-full h-full object-cover"
                        /> */}
                         <Image
                            unoptimized
                            src={item.image ||  noImage.src}
                            onError={(e) => {
                                e.currentTarget.src = noImage.src;
                            }}
                            alt="admin dashboard"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
    )
}