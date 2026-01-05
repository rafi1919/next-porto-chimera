import { PostProjects, PutProjects, getProjects } from "./useAdminApi";
import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import type { PortoProps, FormData } from "./AdminType.ts";

const useAdminForm = () => {
    const { data, isLoading, isError, refetch } = getProjects();
    const { register, handleSubmit, reset } = useForm<FormData>();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [openDetail, setOpenDetail] = useState<boolean>(false);
    const [selected, setSelected] = useState<PortoProps | null>(null);

    const putMutation = PutProjects({
        onSuccess: () => {},
        onError: () => {}
    });

    const postMutation = PostProjects({
        onSuccess: () => {},
        onError: () => {}
    });

    // Reset form when selected item changes
    useEffect(() => {
        if (selected) {
            reset({
                title: selected.title,
                role: selected.role,
                description: selected.description,
                image: selected.image,
            });
        } else {
            reset();
        }
    }, [selected, reset]);

    const handleDetail = (data: PortoProps) => {
        setSelected(data);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleAddPorto=() => {
        setSelected(null);
        setOpenDetail(!openDetail);
    }

    const onSubmit = handleSubmit(async (data: FormData) => {
        try {
            if(selected && selected.id){
                data.id = selected.id;
            }
            const payload = { ...data,};
            if (selected && selected.id) {
                await putMutation.mutateAsync(payload);
            } else {
                await postMutation.mutateAsync(payload);
            }

            reset();
            refetch();
            setOpenDetail(false);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    return {
        // Data
        data,
        isLoading,
        isError,
        
        // Form
        register,
        onSubmit,
        
        // UI State
        openDetail,
        selected,
        fileInputRef,
        
        // Handlers
        handleDetail,
        handleCloseDetail,
        handleFileClick,
        handleAddPorto
    };
};

export default useAdminForm;