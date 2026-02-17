import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { ProjectFormData, ProjectResponse, ProjectParams, Content } from "./AdminType";
import { adminApi, contentApi } from "./useAdminService";
import { toast } from "sonner";

export const GetProjects = (params?: ProjectParams) => {
  return useQuery<ProjectResponse>({
    queryKey: ['projects', params],
    queryFn: async () => {
      const res = await adminApi.get(params);
      if (!res.ok) throw new Error('Failed to fetch projects');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


export const PutProjects=()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: ProjectFormData)=> {
            
            const res = await adminApi.put(data.id, data);
            const response = await res.json()
            
            if (!response.success) {                
                const error = response.message || 'Failed to create project';
                throw new Error(error);
            }

            return response
        },
        onSuccess:()=>{
            toast.success('Project updated successfully');
            queryClient.invalidateQueries({ queryKey: ['projects']});
        },

        onError: (error: { message: string }) => {
            toast.error(`Error updating project: ${error.message}`);
        }
    })
}


export const PostProjects=()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: ProjectFormData)=> {
        
            const res = await adminApi.post(data);
            const response = await res.json()
            
            if (!response.success) {                
                const error = response.message || 'Failed to create project';
                throw new Error(error);
            }

            return response
        },
        onSuccess:()=>{
            toast.success('Project created successfully');
            queryClient.invalidateQueries({ queryKey: ['projects']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error creating project: ${error.message}`);
        },
    })
}

export const GetContent = () => {
  return useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      const res = await contentApi.get();
      if (!res.ok) throw new Error('Failed to fetch contents');
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


export const PutContents=()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: Content)=> {
            
            const res = await contentApi.put(data.id.toString(), data);
            const response = await res.json()
            
            if (!response.success) {                
                const error = response.message || 'Failed to update content';
                throw new Error(error);
            }

            return response
        },
        onSuccess:()=>{
            toast.success('Content updated successfully');
            queryClient.invalidateQueries({ queryKey: ['contents']});
        },

        onError: (error: { message: string }) => {
            toast.error(`Error updating content: ${error.message}`);
        }
    })
}


export const PostContents=()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (data: Content)=> {
        
            const res = await contentApi.post(data);
            const response = await res.json()
            
            if (!response.success) {                
                const error = response.message || 'Failed to create content';
                throw new Error(error);
            }

            return response
        },
        onSuccess:()=>{
            toast.success('Content created successfully');
            queryClient.invalidateQueries({ queryKey: ['contents']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error creating content: ${error.message}`);
        },
    })
}

export const DeleteContents=()=> {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn:async (id: number)=> {
            const res = await contentApi.delete(id.toString());
            const response = await res.json()
            
            if (!response.success) {                
                const error = response.message || 'Failed to delete content';
                throw new Error(error);
            }

            return response
        },
        onSuccess:()=>{
            toast.success('Content deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['contents']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error deleting content: ${error.message}`);
        },
    })
}

export const UploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
        
    const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Failed to upload image');
    }
    
    const data = await res.json();
    return data.data;
}