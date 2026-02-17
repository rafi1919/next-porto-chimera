const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_API_VERSION; // or import.meta.env.VITE_API_URL

export const loginService={

    async login(formData: FormData){
        return fetch(`${apiUrl}/login`, {
            method:'POST',
            body:formData
        })
    }
}