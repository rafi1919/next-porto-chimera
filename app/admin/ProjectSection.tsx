'use client';
import Image from "next/image";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import useAdminForm from "./hooks/useAdminForm";

export default function ProjectSection() {
    const {
        data,
        isLoading,
        isError,
        register,
        onSubmit,
        openDetail,
        fileInputRef,
        handleDetail,
        handleCloseDetail,
        handleFileClick,
    } = useAdminForm();

    return (
        <div className="relative">
            <div className="w-full px-6 grid grid-cols-3 gap-4 pt-7">
                {data?.map((item, index) => (
                    <div key={index} className="w-full h-87 relative overflow-hidden rounded-lg cursor-pointer" onClick={() => handleDetail(item)}>
                        <div className="hover:opacity-100 opacity-0 transition ease-in-out absolute inset-0 flex flex-col justify-end p-6"
                            style={{
                                background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.85) 100%)'
                            }}>
                            <p className="text-zinc-50/70 text-sm">{item.role}</p>
                            <p className="text-zinc-50 text-xl font-semibold">{item.title}</p>
                        </div>
                        <Image
                            src={"https://assets.awwwards.com/awards/media/cache/thumb_880_660/submissions/2025/12/693dfbef5a03a769840183.jpg"}
                            alt="admin dashboard"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>
            <motion.div
                initial={{ y: "100%" }}
                animate={openDetail ? { y: 0 } : { y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed h-[85vh] rounded-t-md bg-zinc-200 w-full bottom-0 p-4">
                <button className="bg-[#222222] p-5 rounded-md cursor-pointer" onClick={handleCloseDetail}>
                    <Icon icon="mdi:close" className="text-[25px]" />
                </button>
                <div>
                    <form onSubmit={onSubmit} className="flex-col grid grid-cols-2 w-full">
                        <div className="flex justify-between w-full ">
                            <div className="rounded bg-black w-50 h-50 cursor-pointer flex items-center justify-center text-zinc-50" onClick={handleFileClick}>
                                Click to upload image
                                <input ref={fileInputRef} type="file" className="hidden" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <input id="title" type="text" placeholder="title" {...register("title")} className="input-field" />
                            <textarea id="description" placeholder="description" {...register("description")} className="input-field" />

                            <select id="role" className="input-field" {...register("role")}>
                                <option value="">Select Role</option>
                                <option value="maintainer">Maintainer</option>
                                <option value="developer">Developer</option>
                            </select>
                            <button type="submit" className="bg-black text-zinc-50 px-4 py-3 rounded-md w-fit mt-4">Save Changes</button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}