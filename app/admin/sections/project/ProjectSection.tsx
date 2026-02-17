'use client';

import Image from "next/image";
import { Icon} from "@iconify/react";
import useProjectForm from "./hook/useProjectForm";
import { PortoCard } from "../../components/PortoCard";
import { BottomDialog } from "../../components/BottomDialog";
import noImage from  "@/public/no-data.svg"
import EmptyDisplay from "../../components/EmptyDisplay";
import Pagination from "../../components/Pagination";

export default function ProjectSection() {
    const {
        projectData,
        meta,
        selectedFile,
        isFetching,
        isError,
        selected,
        search,
        page,
        register,
        watch,
        setValue,
        onSubmit,
        errors,
        isSubmitting,
        openDetail,
        fileInputRef,
        handleDetail,
        handleCloseDetail,
        handleFileChange,
        handleAddPorto,
        handleSearch,
        handlePageChange
    } = useProjectForm();

    if( isError) {
        return <p className="text-center text-zinc-50 mt-10">An error occurred while fetching data.</p>
    }

    if( isFetching) {
        return <p className="text-center text-zinc-50 mt-10">Loading...</p>
    }
    
    return (
        <div className="relative w-full">
              <div className="mx-auto flex justify-center items-center pt-10 gap-3">
                <input 
                    type="search" 
                    placeholder="search by name" 
                    className="input-field"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="border-2 border-white rounded p-3 cursor-pointer" onClick={handleAddPorto}>
                    <Icon icon="mingcute:add-fill" className="text-[25px]  " />
                </button>
              </div>

             
            <div className="w-full px-6 grid grid-cols-3 gap-4 pt-7">
                {meta.total === 0 && !isFetching &&
                  <EmptyDisplay imagePath={noImage.src} title="Data tidak ada" message="Tidak ada data yang tersedia saat ini."/>
                }

                {meta.filtered_total > 0 ? (
                    projectData.map((item, index) => (
                        <PortoCard key={index} item={item} onClick={() => handleDetail(item)} />
                    ))
                ) : (
                    <div className="col-span-3">
                        <EmptyDisplay imagePath={noImage.src} title="Data tidak ada" message="TCoba cari kata kunci yang lain"/>
                    </div>
                )}
            </div>

            <Pagination meta={meta} page={page} onPageChange={handlePageChange} />

            {openDetail &&
                <BottomDialog openDetail={openDetail} handleCloseDetail={handleCloseDetail}>
                    <form onSubmit={onSubmit} className=" grid md:grid-cols-2 grid-cols-1 w-full gap-4">
                            <div className="flex justify-between w-full " onClick={() => fileInputRef.current?.click()}>
                                <input ref={fileInputRef} type="file" accept="image/*"  className="hidden" onChange={handleFileChange}/>

                                <div className="rounded  w-full h-100 cursor-pointer flex items-center justify-center text-zinc-50" >
                                    {selectedFile ? 
                                        <Image 
                                            src={URL.createObjectURL(selectedFile)}
                                            alt="Selected file" height={100} width={100}  className="w-full h-full object-contain"/>
                                        :
                                        
                                        selected?.image 
                                        ?
                                            <Image unoptimized src={selected?.image || noImage.src} 
                                                alt="Selected file" 
                                                height={100} width={100}  
                                                onError={(e) => {
                                                    e.currentTarget.src = noImage.src;
                                                }}
                                                className="w-full h-full object-contain"/>
                                        :
                                            <div className="rounded bg-black w-full h-100 cursor-pointer flex items-center justify-center text-zinc-50" >
                                                Click to upload image
                                            </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <input id="title" type="text" placeholder="title" {...register("title", { required: "Title is required" })} className="input-field" />
                                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                                <textarea id="description" placeholder="description" {...register("description")} className="input-field" />

                                <select id="role" className="input-field" {...register("role", { required: "Role is required" })}>
                                    <option value="">Select Role</option>
                                    <option value="maintainer">Maintainer</option>
                                    <option value="developer">Developer</option>
                                </select>
                                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                                <input id="link" type="text" placeholder="link porto" {...register("link")} className="input-field" />
                                <label htmlFor="is_active" className="flex items-center gap-3 cursor-pointer select-none">
                                    <span className="text-black text-sm">Active</span>
                                    <button
                                        type="button"
                                        id="is_active"
                                        role="switch"
                                        aria-checked={watch("is_active")}
                                        onClick={() => setValue("is_active", !watch("is_active"))}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${watch("is_active") ? "bg-green-500" : "bg-zinc-600"}`}
                                    >
                                        <span className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${watch("is_active") ? "translate-x-6" : "translate-x-1"}`} />
                                    </button>
                                </label>

                                <button type="submit" disabled={isSubmitting} className="bg-black text-zinc-50 px-4 py-3 rounded-md w-fit mt-4 disabled:opacity-50 cursor-pointer">
                                    {isSubmitting ? "Submitting..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                </BottomDialog>
            }
        </div>
    );
}