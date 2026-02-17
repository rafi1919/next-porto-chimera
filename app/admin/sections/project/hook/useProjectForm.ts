'use client';

import { PostProjects, PutProjects, UploadImage, GetProjects } from "../../../hooks/useAdminApi";
import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";
import { useDebounce } from "use-debounce";
import type { PortoProps, ProjectFormData, } from "../../../hooks/AdminType";

const useProjectForm = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const [debouncedSearch] = useDebounce(inputValue, 500);
    const [page, setPage] = useState<number>(1);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data, isFetching, isError, refetch } = GetProjects({
        title: debouncedSearch || undefined,
        offset:page,
        limit: 12
    });
    const putMutation = PutProjects();
    const postMutation = PostProjects();
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selected, setSelected] = useState<PortoProps | null>(null);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const { register, handleSubmit, reset, watch, setValue, formState: { errors },  } = useForm<ProjectFormData>({ defaultValues: { is_active: false } });
    const handleSearch = (title: string) => {
        setInputValue(title);
        setPage(1);
    };

    useEffect(() => {
        reset({
            title: selected?.title || '',
            role: selected?.role || '',
            description: selected?.description || '',
            image: selected?.image || '',
            link: selected?.link || '',
            is_active: selected?.is_active ?? false,
        });
    }, [selected, reset]);

    const handleDetail = (data: PortoProps) => {        
        setSelected(data);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelected(null);
        setSelectedFile(null);
        reset();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFile(e.target.files?.[0] || null);
    };

    const handleAddPorto=() => {
        setSelected(null);
        setOpenDetail(!openDetail);
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const uploadImage =async()=>{
        const res = await UploadImage(selectedFile!);
        return res;
    }
    const onSubmit = handleSubmit(async (data: ProjectFormData) => {
        setIsSubmitting(true);
        try {
            let imageUrl;
            
            if(selectedFile){
                imageUrl = await uploadImage();
            }

            const payload = { 
                ...data, 
                image: imageUrl,
                ...(selected?.id && {id: selected.id})
             };
             
            if (selected && selected.id) {
                await putMutation.mutateAsync(payload);
            } else {
                await postMutation.mutateAsync(payload);
            }

            reset();
            refetch();
            setOpenDetail(false);
            setIsSubmitting(false)
        } catch (error) {
            console.error('Error:', error);
            setIsSubmitting(false)
        }
    });

    return {
        // Data
        projectData: isFetching ? [] : data.data || [],
        meta: isFetching ? [] : data.meta || [],
        isFetching,
        isError,
        selectedFile,
        search: inputValue,
        page,
        
        // Form
        register,
        watch,
        setValue,
        onSubmit,
        errors,
        isSubmitting,
        
        // UI State
        openDetail,
        selected,
        fileInputRef,
        
        // Handlers
        handleDetail,
        handleCloseDetail,
        handleFileChange,
        handleAddPorto,
        handleSearch,
        handlePageChange
    };
};

export default useProjectForm;