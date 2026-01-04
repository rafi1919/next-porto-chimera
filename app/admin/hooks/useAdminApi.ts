import axios from "axios";
import { useQuery, useQueryClient, useMutation, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import { FormData } from "./AdminType";
import { AxiosError, AxiosResponse } from 'axios';

interface ResponseApiWithMeta<T> {
    data: T;
    meta?: any;
}

export const getProjects=(
    params?: any,
    options?:Omit<UseQueryOptions, 'queryKey' | 'queryFn' >
)=> {
    const res = useQuery({
        queryKey: ['projects', params],
        queryFn: async () => {
            const res = await axios.get('/api/project');
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        ...options
    });

    return res;
}

export const PutProjects=(
    options?: Omit<UseMutationOptions<AxiosResponse<ResponseApiWithMeta<FormData>>, AxiosError, FormData & { id?: string }, any>, 'mutationKey' | 'mutationFn'>
)=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: FormData)=> await axios.put('/api/project', data, {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }),
        onSuccess:(response, data, ...args)=>{
            queryClient.invalidateQueries({ queryKey: ['projects']});
            options?.onSuccess?.(response, data, ...args);
        },
        ...options
    })
}


export const PostProjects=(
    options?: Omit<UseMutationOptions<AxiosResponse<ResponseApiWithMeta<FormData>>, AxiosError, FormData & { id?: string }, any>, 'mutationKey' | 'mutationFn'>
)=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: FormData)=> await axios.post('/api/project', data, {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        }),
        onSuccess:(response, data, ...args)=>{
            queryClient.invalidateQueries({ queryKey: ['projects']});
            options?.onSuccess?.(response, data, ...args);
        },
        ...options
    })
}

