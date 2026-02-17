"use client";

import { Button } from "../components/Button";
import useLoginHook from "./hook/useLoginHook";
export default function LoginPage() {
    const { register, handleSubmit, onSubmit, isSubmitting } = useLoginHook();
    
    return(
        <div className="min-h-screen flex flex-col justify-center items-center bg-black">
            <div className="relative backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-4 w-full">
                        <div className="w-full">
                             <label className="block text-sm font-medium text-purple-100 mb-2">
                                Username
                            </label>
                            <input className="input-field" {...register("username")} disabled={isSubmitting} />
                        </div>
                        <div className="w-full">
                             <label className="block text-sm font-medium text-purple-100 mb-2">
                                Password
                            </label >
                            <input className="input-field" type="password" {...register("password")} disabled={isSubmitting} />
                        </div>
                        <Button text="Login" isLoading={isSubmitting} />
                    </div>
                </form>
            </div>
           
        </div>
    )
}