import { useQuery, UseQueryOptions } from "@tanstack/react-query"
import { homeApi } from "./useHomeService";
import { ContentData, ProjectData } from "./HomeType";

const sharedOptions = {
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
} as const;

export const useGetTop = (
    options?: Omit<UseQueryOptions<ProjectData>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ProjectData>({
        queryKey: ['getTop'],
        queryFn: async () => {
            const res = await homeApi.getTop();
            return res.json();
        },
        ...sharedOptions,
        ...options,
    });
};

export const useGetLandingContent = (
    options?: Omit<UseQueryOptions<ContentData>, 'queryKey' | 'queryFn'>
) => {
    return useQuery<ContentData>({
        queryKey: ['getLandingContent'],
        queryFn: async () => {
            const res = await homeApi.getLandingContent();
            return res.json();
        },
        ...sharedOptions,
        ...options,
    });
};
