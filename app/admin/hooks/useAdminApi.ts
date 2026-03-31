import { useQuery, useQueryClient, useMutation} from "@tanstack/react-query";
import { PortoFormData, PortoResponse, PortoParams, Content } from "./AdminType";
import { adminApi, contentApi } from "./useAdminService";
import { rootFetch } from "@/service/service";
import { toast } from "sonner";

const sharedOptions ={
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
}
export const GetPortos = (params?: PortoParams) => {
  return useQuery<PortoResponse>({
    queryKey: ['portos', params],
    queryFn: async () => {
      const res = await adminApi.get(params);
      if (!res.ok) throw new Error('Failed to fetch portos');
      return res.json();
    },
    ...sharedOptions
  });
};


export const PutPortos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PortoFormData) => {
            const res = await adminApi.put(data.id, data);
            const response = await res.json()

            if (!response.success) {
                const error = response.message || 'Failed to update porto';
                throw new Error(error);
            }

            return response
        },
        onSuccess: () => {
            toast.success('Porto updated successfully');
            queryClient.invalidateQueries({ queryKey: ['portos']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error updating porto: ${error.message}`);
        }
    })
}


export const PostPortos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: PortoFormData) => {
            const res = await adminApi.post(data);
            const response = await res.json()

            if (!response.success) {
                const error = response.message || 'Failed to create porto';
                throw new Error(error);
            }

            return response
        },
        onSuccess: () => {
            toast.success('Porto created successfully');
            queryClient.invalidateQueries({ queryKey: ['portos']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error creating porto: ${error.message}`);
        },
    })
}

export const DeletePortos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await adminApi.delete(id);
            const response = await res.json();

            if (!response.success) {
                const error = response.message || 'Failed to delete porto';
                throw new Error(error);
            }

            return response;
        },
        onSuccess: () => {
            toast.success('Porto deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['portos'] });
        },
        onError: (error: { message: string }) => {
            toast.error(`Error deleting porto: ${error.message}`);
        },
    });
};

export const GetContent = () => {
  return useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      const res = await contentApi.get();
      if (!res.ok) throw new Error('Failed to fetch contents');
      return res.json();
    },
    ...sharedOptions
  });
};

export const PutContents = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Content) => {
            const res = await contentApi.put(data.id.toString(), data);
            const response = await res.json()

            if (!response.success) {
                const error = response.message || 'Failed to update content';
                throw new Error(error);
            }

            return response
        },
        onSuccess: () => {
            toast.success('Content updated successfully');
            queryClient.invalidateQueries({ queryKey: ['contents']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error updating content: ${error.message}`);
        }
    })
}

export const PostContents = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Content) => {
            const res = await contentApi.post(data);
            const response = await res.json()

            if (!response.success) {
                const error = response.message || 'Failed to create content';
                throw new Error(error);
            }

            return response
        },
        onSuccess: () => {
            toast.success('Content created successfully');
            queryClient.invalidateQueries({ queryKey: ['contents']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error creating content: ${error.message}`);
        },
    })
}

export const DeleteContents = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const res = await contentApi.delete(id.toString());
            const response = await res.json()

            if (!response.success) {
                const error = response.message || 'Failed to delete content';
                throw new Error(error);
            }

            return response
        },
        onSuccess: () => {
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

    const res = await rootFetch('/upload-image', {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error('Failed to upload image');
    }

    const data = await res.json();
    return data.data;
}
