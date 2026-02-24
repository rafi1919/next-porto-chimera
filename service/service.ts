import { toast } from "sonner";

const apiUrl =
  process.env.NEXT_PUBLIC_APP === 'local'
    ? process.env.NEXT_PUBLIC_API_URL_LOCAL
    : process.env.NEXT_PUBLIC_API_URL_PROD;

const BASE_URL = apiUrl + '/' + process.env.NEXT_PUBLIC_API_VERSION;

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  localStorage.setItem('token', token);
}

export function clearToken(): void {
  localStorage.removeItem('token');
}

export async function rootFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      window.location.href = '/';
    }

    if (response.status === 422) {
      toast.error('Validation error. Please check your input and try again.');
    }

    if (response.status === 429) {
      toast.error('Too many requests. Please wait and try again later.');      
    }

    return response;
  } catch (error) {
    throw error;
  }
}
