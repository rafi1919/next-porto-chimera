'use client';
import { useGetContent } from "./hook/useHomeApi";

export default function BannerSection() {
  const { data, isFetching, error } = useGetContent();
  const content =data? data?.data.find((item)=> item.category === 'banner') : null;
  
  return (
    <div className="relative flex items-center justify-center min-h-screen  font-sans bg-black p-4 gap-6">
       <h1 className="p-4 text-5xl absolute top-0 left-0 font-black leading-10 tracking-tight text-zinc-50 uppercase">
        RAIN <br/>
        OUTSIDE <br/>
        .CO
      </h1>
      
      {!isFetching && content&& !error && content.body ? 
          <h1 className="max-w-xs text-3xl font-semibold leading-6 tracking-tight text-zinc-50">
            {content.body}
          </h1>
        :
        <h1 className="max-w-xs text-3xl font-semibold leading-6 tracking-tight text-zinc-50">
            It&apos;s not all about code, it&apos;s about crafting digital experiences that resonate.
          </h1>
      }

    </div>
  );
}
