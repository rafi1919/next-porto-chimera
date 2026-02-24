import { rootFetch } from '@/service/service';
import type { Content, PortoFormData, PortoParams } from './AdminType';

export const adminApi = {
  async get(params?: PortoParams) {
    const query = new URLSearchParams();
    if (params?.offset) query.append('offset', params.offset.toString());
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.title) query.append('title', params.title);

    const queryString = query.toString();
    return rootFetch(`/portos${queryString ? `?${queryString}` : ''}`);
  },

  async post(formData: PortoFormData) {
    return rootFetch('/portos', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async put(id: string, formData: PortoFormData) {
    return rootFetch(`/portos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  },

  async delete(id: string) {
    return rootFetch(`/portos/${id}`, {
      method: 'DELETE',
    });
  },
};

export const contentApi = {
  async get() {
    return rootFetch('/contents');
  },

  async post(formData: Content) {
    return rootFetch('/contents', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  },

  async put(id: string, formData: Content) {
    return rootFetch(`/contents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });
  },

  async delete(id: string) {
    return rootFetch(`/contents/${id}`, {
      method: 'DELETE',
    });
  },
};
