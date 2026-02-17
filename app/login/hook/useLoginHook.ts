"use client";

import { useForm } from "react-hook-form";
import { Login } from "./useLoginApi";

interface LoginData {
    username: string;
    password: string;
}

const useLoginHook = () => {
    const { register, handleSubmit, formState: { errors, isSubmitting }, } = useForm<LoginData>();
    const LoginMutation = Login();

    const onSubmit = (data: LoginData) => {
        LoginMutation.mutate(data);
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting
    }
}

export default useLoginHook;