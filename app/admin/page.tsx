'use client';
import React, { useState, lazy, Suspense } from "react"; 
import { AnimatePresence, motion } from "framer-motion";
import ButtonNav from "../components/ButtonNav";

const ProjectSection = lazy(() => import("./sections/project/ProjectSection"));
const StackSection = lazy(() => import("./sections/stack/StackSection"));
const ContentSection = lazy(() => import("./sections/content/ContentSection"));
const ProfileSection = lazy(() => import("./sections/profile/ProfileSection"));

export default function Admin() {
  const [selected, setSelected] = useState(0)

  const navList=[
    {name:"Project"},
    {name:"Stack"},
    {name:"Content"},
    {name:"Profile"},
  ]

  const components = [ProjectSection, StackSection, ContentSection, ProfileSection];

  return (
    <div className="min-h-screen font-sans bg-black overflow-hidden">
      <main className="relative p-4">
        <div className="p-2 rounded-md bg-[#222222] flex gap-4 border-solid w-fit sticky z-100 top-0 right-0 left-0 m-auto">
          {navList.map((item, index)=>(
              <ButtonNav key={index} text={item.name} isActive={selected === index} onClick={()=> setSelected(index)} className="cursor-pointer" />
          ))}
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Suspense fallback={<div>Loading...</div>}>
              {React.createElement(components[selected])}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
