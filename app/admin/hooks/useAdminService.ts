const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_API_VERSION; // or import.meta.env.VITE_API_URL
import type {Content, ProjectFormData, ProjectParams} from "./AdminType";

export const adminApi = {
  async get(params?: ProjectParams) {
    const query = new URLSearchParams();
    if (params?.offset) query.append('offset', params.offset.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.title) query.append('title', params.title);
    
    const queryString = query.toString();
    return fetch(`${apiUrl}/portos${queryString ? `?${queryString}` : ''}`);
  },

  async post(formData:ProjectFormData ) {
    return fetch(`${apiUrl}/portos`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
 
    });
  },

  async put(id: string, formData: ProjectFormData ) {
    return fetch(`${apiUrl}/portos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json'
      }
    });
  },
};

export const contentApi = {
  async get() {  
    return fetch(`${apiUrl}/contents`);
  },

  async post(formData:Content ) {
    return fetch(`${apiUrl}/contents`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
 
    });
  },

  async put(id: string, formData: Content ) {
    return fetch(`${apiUrl}/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
      headers:{
        'Content-Type': 'application/json'
      }
    });
  },

  async delete(id: string) {
    return fetch(`${apiUrl}/contents/${id}`, {
      method: 'DELETE',
      headers:{
        'Content-Type': 'application/json'
      }
    });
  },
};
