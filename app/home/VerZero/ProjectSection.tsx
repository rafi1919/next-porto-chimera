'use client';

import { Icon } from "@iconify/react";
import ProjectCard from "../../components/ProjectCard";
import { motion } from 'framer-motion';
import { useGetTop } from "../hook/useHomeApi";

export default function ProjectSection() {
  const { data, isFetching } = useGetTop();

  const projectData = data?.data;

  if (isFetching) return <p>Loading...</p>;

  return (
    <div className="min-[300vh] relative font-sans bg-black p-4">
      {projectData?.map((item, index) => (
        <motion.div
          style={{
            position: 'sticky',
            top: `${index !== 0 ? 60 + index * 40 : 0}px`,
            zIndex: index + 1,
          }}
          key={item.id}
          className="w-full h-full"
        >
          {index === 0 && (
            <div className="flex items-end justify-start gap-7">
              <p className="text-sm font-mono text-zinc-50 pt-4">02 - PROJECTS</p>
              <p className="flex items-center justify-start text-[#222222] gap-2 bg-white cursor-pointer p-1 pl-1 hover:pl-3 transition duration-300 ease-in-out">
                More Project <Icon icon="iconamoon:player-next-fill" />
              </p>
            </div>
          )}

          <ProjectCard
            title={item.title}
            description={item.description}
            image={item.image}
            link={item.link}
            role={item.role}
            stack={item.stack}
          />
        </motion.div>
      ))}
    </div>
  );
}
