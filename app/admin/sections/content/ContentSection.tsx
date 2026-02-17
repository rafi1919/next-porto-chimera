'use client';

import { Icon } from "@iconify/react";
import useContentForm from "./hook/useContentForm";
import { BottomDialog } from "../../components/BottomDialog";
import EmptyDisplay from "../../components/EmptyDisplay";
import noImage from "@/public/no-data.svg";
import type { Content } from "../../hooks/AdminType";

export default function ContentSection() {
    const {
        contentData,
        isLoading,
        isError,
        selected,
        search,
        register,
        onSubmit,
        errors,
        isSubmitting,
        openDetail,
        handleDetail,
        handleCloseDetail,
        handleAddContent,
        handleSearch,
        handleDelete
    } = useContentForm();

    if (isError) {
        return <p className="text-center text-zinc-50 mt-10">An error occurred while fetching data.</p>
    }

    if (isLoading) {
        return <p className="text-center text-zinc-50 mt-10">Loading...</p>
    }

    const filteredData = contentData.filter((item: Content) => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative w-full">
            <div className="mx-auto flex justify-center items-center pt-10 gap-3">
                <input
                    type="search"
                    placeholder="search by title or category"
                    className="input-field"
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <button className="border-2 border-white rounded p-3 cursor-pointer" onClick={handleAddContent}>
                    <Icon icon="mingcute:add-fill" className="text-[25px]" />
                </button>
            </div>

            <div className="w-full px-6 pt-7">
                {contentData.length === 0 && !isLoading && (
                    <EmptyDisplay imagePath={noImage.src} title="No content" message="No content available at the moment." />
                )}

                {filteredData.length > 0 ? (
                    <div className="space-y-4 flex flex-col items-center">
                        {filteredData.map((item: Content) => (
                            <div
                                key={item.id}
                                className="bg-[#0f0f0f] rounded-lg p-6 shadow-md hover:shadow-lg  max-w-lg w-full border border-gray-400 transition-shadow cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1" onClick={() => handleDetail(item)}>
                                        <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-gray-600 mb-3">
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                        </p>
                                        {/* <p className="text-gray-700 line-clamp-2">{item.body}</p> */}
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(item.id);
                                        }}
                                        className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <Icon icon="mingcute:delete-2-fill" className="text-[24px]" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    search && (
                        <EmptyDisplay
                            imagePath={noImage.src}
                            title="No results"
                            message="Try searching with different keywords"
                        />
                    )
                )}
            </div>

            {openDetail && (
                <BottomDialog openDetail={openDetail} handleCloseDetail={handleCloseDetail}>
                    <form onSubmit={onSubmit} className="w-full max-w-2xl mx-auto space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {selected ? 'Edit Content' : 'Add New Content'}
                        </h2>
                        
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                {...register("title", { required: "Title is required" })}
                                className="input-field w-full"
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div>
                            <input
                                type="text"
                                placeholder="Category"
                                {...register("category", { required: "Category is required" })}
                                className="input-field w-full"
                            />
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <textarea
                                placeholder="Content body"
                                {...register("body", { required: "Body is required" })}
                                className="input-field w-full min-h-[200px]"
                            />
                            {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-zinc-50 px-6 py-3 rounded-md w-fit disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? "Submitting..." : "Save Content"}
                        </button>
                    </form>
                </BottomDialog>
            )}
        </div>
    );
}