'use client';

import { Icon } from "@iconify/react";
import Image from "next/image";
import useProfileForm from "./hook/useProfileForm";
import { Button } from "@/app/components/Button";

export default function ProfileSection() {
    const { register, handleSubmit, onSubmit, errors, isSubmitting, selectedFile, fileInputRef, handleFileChange } = useProfileForm();

    return (
        <div className="w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex justify-center">
                    <div
                        className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {selectedFile ? (
                            <Image
                                src={URL.createObjectURL(selectedFile)}
                                alt="Profile"
                                width={128}
                                height={128}
                                className="w-full h-full object-cover rounded-full"
                            />
                        ) : (
                            <Icon icon="mingcute:user-fill" className="text-4xl text-gray-400" />
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                        Username
                    </label>
                    <input
                        className="input-field"
                        {...register("username")}
                        disabled={isSubmitting}
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        className="input-field"
                        {...register("email")}
                        disabled={isSubmitting}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-purple-100 mb-2">
                        Phone
                    </label>
                    <input
                        type="tel"
                        className="input-field"
                        {...register("phone")}
                        disabled={isSubmitting}
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                </div>

                <Button text="Save Profile" isLoading={isSubmitting} />
            </form>
        </div>
    );
}