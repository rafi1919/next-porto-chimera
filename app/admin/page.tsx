'use client';
import { useState } from "react"; 
import { Suspense } from "react";
import ButtonNav from "../components/ButtonNav";
import ProjectSection from "./ProjectSection";

export default function Admin() {
  const [selected, setSelected] = useState(0)

  const navList=[
    {name:"Project"},
    {name:"Stack"},
    {name:"Content"},
    {name:"Profile"},
  ]

  return (
    <div className="min-h-screen font-sans dark:bg-black">
      <main className="relative py-4">
        <div className="p-2 rounded-md bg-[#222222] flex gap-4 border-solid w-fit sticky top-0 right-0 left-0 m-auto">
          {navList.map((item, index)=>(
              <ButtonNav key={index} text={item.name} isActive={selected === index} onClick={()=> setSelected(index)} className="cursor-pointer" />
          ))}
        </div>
        
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectSection />
        </Suspense>
      </main>
    </div>
  );
}
