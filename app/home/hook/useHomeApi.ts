import { useQuery, UseQueryOptions,  } from "@tanstack/react-query"
import { homeApi } from "./useHomeService";
import { ContentData, ProjectData } from "./HomeType";

export const GetTop=(
    options?:Omit<UseQueryOptions<ProjectData>, 'queryKey' | 'queryFn' >
)=>{
    return useQuery<ProjectData>({
        queryKey:['getTop'],
        queryFn: async()=>{
            const res = await homeApi.getTop();
            const data = await res.json();
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        ...options  
    })
}

export const useGetContent=(
    options?:Omit<UseQueryOptions<ContentData>, 'queryKey' | 'queryFn' >
)=>{
    return useQuery<ContentData>({
        queryKey:['getContent'],
        queryFn: async()=>{
            const res = await homeApi.getContent();
            const data = await res.json();
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes,
        gcTime: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        ...options  
    })
}