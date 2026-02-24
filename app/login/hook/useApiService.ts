import { rootFetch } from '@/service/service';

export const loginService = {
  async login(formData: FormData) {
    return rootFetch('/auth/login', {
      method: 'POST',
      body: formData,
    });
  },
};
