import { PostContents, PutContents, DeleteContents, GetContent } from "../../../hooks/useAdminApi";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import type { Content } from "../../../hooks/AdminType";

const useContentForm = () => {
    const [search, setSearch] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { data, isLoading, isError, refetch } = GetContent();
    const putMutation = PutContents();
    const postMutation = PostContents();
    const deleteMutation = DeleteContents();

    const [selected, setSelected] = useState<Content | null>(null);
    const [openDetail, setOpenDetail] = useState<boolean>(false);
    
    const { register, handleSubmit, reset, formState: { errors },  } = useForm<Content>();
    const handleSearch = (title: string) => {
        setSearch(title);
    };
    
    useEffect(() => {
        reset({
            id: selected?.id || 0,
            title: selected?.title || '',
            body: selected?.body || '',
            category: selected?.category || '',
        });
    }, [selected, reset]);

    const handleDetail = (data: Content) => {        
        setSelected(data);
        setOpenDetail(true);
    };

    const handleCloseDetail = () => {
        setOpenDetail(false);
        setSelected(null);
        reset();
    };

    const handleAddContent=() => {
        setSelected(null);
        reset();
        setOpenDetail(true);
    }

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this content?')) {
            try {
                await deleteMutation.mutateAsync(id);
                refetch();
            } catch (error) {
                console.error('Error deleting content:', error);
            }
        }
    };

    const onSubmit = handleSubmit(async (data: Content) => {
        setIsSubmitting(true);
        try {
            const payload = { ...data };
             
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
        contentData: data?.data || [],
        isLoading,
        isError,
        search,
        
        // Form
        register,
        onSubmit,
        errors,
        isSubmitting,
        
        // UI State
        openDetail,
        selected,
        
        // Handlers
        handleDetail,
        handleCloseDetail,
        handleAddContent,
        handleSearch,
        handleDelete
    };
};

export default useContentForm;