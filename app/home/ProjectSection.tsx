'use client';

import { Icon } from "@iconify/react";
import ProjectCard from "../components/ProjectCard";
import {motion} from 'framer-motion';
import { useRef } from "react";
import HomeForm from "./hook/useHomeForm";

export default function ProjectSection() {
  const cardRef = useRef(null);
  const {
    data,
    isLoading,
    isError
  } = HomeForm();
  console.log('data', data);
  
  const dummyProjects=[
    {
      title: "Project One",
      description: "This is a brief description of Project One.",
      imageUrl: "/project-one.png",
      link:"/#",
      role:'maintainer',
      stack:['Next.js','Tailwind CSS','TypeScript']
    },
    {
      title: "Project Two",
      description: "This is a brief description of Project One.",
      imageUrl: "/project-one.png",
      link:"/#",
      role:'maintainer',
      stack:['React','TypeScript']
    },
    {
      title: "Project Three",
      description: "This is a brief description of Project One.",
      imageUrl: "/project-one.png",
      link:"/#",
      role:'maintainer',
      stack:['VUe','Laravel']
    }]

  return (
    
    <div className="min-[300vh] relative bg-zinc-50 font-sans dark:bg-black p-4">

        {dummyProjects.map((item, index)=>(
           <motion.div
            ref={cardRef}
            style={{
              position:'sticky',
              top:`${index != 0 ? 60 + index *40 : 0}px`,
              zIndex: index +1,

              }}
            key={index} 
            className="w-full h-full"

            >  
            {index === 0 && (
            <div className="flex items-end justify-start gap-7">
              <p className=' text-sm font-mono text-zinc-50 pt-4' >02 - PROJECTS</p>
              <p className="flex items-center justify-start text-[#222222] gap-2 bg-white cursor-pointer p-1 pl-1 hover:pl-3 transition duration-300 ease-in-out">More Project <Icon icon="iconamoon:player-next-fill" /></p>
            </div>
            )}

            <ProjectCard  
              title={item.title} 
              description={item.description} 
              imageUrl={item.imageUrl}
              link={item.link}
              role={item.role}
              stack={item.stack} />
           </motion.div>
        ))}
    </div>
  );
}
