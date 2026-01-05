import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import axios from "axios";

export const getTop=(
    params?: any,
    options?:Omit<UseQueryOptions, 'queryKey' | 'queryFn' >
)=>{
    const res = useQuery({
        queryKey:['getTop', params],
        queryFn: async()=>{
            const res = await axios.get('/api/home');
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        ...options  
    })

    return res;
}