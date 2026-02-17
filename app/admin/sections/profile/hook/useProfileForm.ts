import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import type { ProfileData } from "../../../hooks/AdminType";

const useProfileForm = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProfileData>();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const onSubmit = (data: ProfileData) => {
        console.log(data);
        // TODO: Implement submit logic
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        selectedFile,
        fileInputRef,
        handleFileChange,
        reset
    };
};
export default useProfileForm;