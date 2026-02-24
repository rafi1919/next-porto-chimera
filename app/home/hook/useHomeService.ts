import { rootFetch } from '@/service/service';

export const homeApi = {
  async getTop() {
    return rootFetch('/top-porto');
  },

  async getLandingContent() {
    return rootFetch('/landing-content');
  },
};
