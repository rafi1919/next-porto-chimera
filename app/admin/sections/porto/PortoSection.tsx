'use client';

import Image from "next/image";
import { Icon} from "@iconify/react";
import { useState, useMemo } from "react";
import usePortoForm from "./hook/usePortoForm";
import { DeletePortos } from "../../hooks/useAdminApi";
import { PortoCard } from "../../components/PortoCard";
import { BottomDialog } from "../../components/BottomDialog";
import { ConfirmDeleteDialog } from "@/app/components/DIalog/ConfirmDeleteDialog";
import noImage from  "@/public/no-data.svg"
import EmptyDisplay from "../../components/EmptyDisplay";
import Pagination from "../../components/Pagination";

export default function PortoSection() {
    const { mutate: deletePorto } = DeletePortos();
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const {
        portoData,
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
    } = usePortoForm();

    const selectedFileUrl = useMemo(
        () => (selectedFile ? URL.createObjectURL(selectedFile) : null),
        [selectedFile]
    );

    if( isError) {
        return <p className="text-center text-zinc-50 mt-10">An error occurred while fetching data.</p>
    }

    if( isFetching) {
        return <p className="text-center text-zinc-50 mt-10">Loading...</p>
    }

    if(!meta){
        return <p className="text-center text-zinc-50 mt-10">No data available.</p>
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

                {meta.filtered_total > 0 && !isFetching  ? (
                    portoData.map((item) => (
                        <PortoCard key={item.id} item={item} onClick={() => handleDetail(item)} onDelete={(e) => { e.stopPropagation(); setDeleteTarget(item.id); }} />
                    ))
                ) : (
                    <div className="col-span-3">
                        <EmptyDisplay imagePath={noImage.src} title="Data tidak ada" message={meta.total === 0 ? "Tidak ada data yang tersedia saat ini.": "Coba cari kata kunci yang lain"}/>
                    </div>
                )}
            </div>

            <Pagination meta={meta} page={page} onPageChange={handlePageChange} />

            <ConfirmDeleteDialog
                isOpen={!!deleteTarget}
                onCancel={() => setDeleteTarget(null)}
                onConfirm={() => { deletePorto(deleteTarget!); setDeleteTarget(null); }}
                title="Delete Porto"
                message="Are you sure you want to delete this porto? This action cannot be undone."
            />

            <BottomDialog openDetail={openDetail} handleCloseDetail={handleCloseDetail}>
                <form onSubmit={onSubmit} className=" grid md:grid-cols-2 grid-cols-1 w-full gap-4">
                        <div className="flex justify-between w-full " onClick={() => fileInputRef.current?.click()}>
                            <input ref={fileInputRef} type="file" accept="image/*"  className="hidden" onChange={handleFileChange}/>

                            <div className="rounded  w-full h-100 cursor-pointer flex items-center justify-center text-zinc-50" >
                                {selectedFileUrl ?
                                    <Image
                                        src={selectedFileUrl}
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
        </div>
    );
}
