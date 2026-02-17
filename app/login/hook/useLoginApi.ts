import { QueryClient, useMutation } from "@tanstack/react-query"
import { loginService } from "./useApiService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const Login = ()=>{
    const queryClient = new QueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: {username: string, password: string}) => {
            const formData = new FormData();
            formData.append('username', data.username);
            formData.append('password', data.password);

            const res = await loginService.login(formData);
            const response = await res.json();

            if(!res.ok){
                throw response;
            }

            return response;
        },
        onSuccess:()=>{
            toast.success('Login successful');
            document.cookie = "isAuth=true; path=/; max-age=3600";
            router.push('/admin');
            queryClient.invalidateQueries({ queryKey: ['login']});
        },
        onError: (error: { message: string }) => {
            toast.error(`Error logging in: ${error.message}`);
        },
    })
}