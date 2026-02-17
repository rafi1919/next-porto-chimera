const apiUrl = process.env.NEXT_PUBLIC_API_URL + '/' + process.env.NEXT_PUBLIC_API_VERSION; // or import.meta.env.VITE_API_URL


export const homeApi = {
  async getTop() {
    return fetch(`${apiUrl}/top-porto`);
  },

   async getContent() {
    return fetch(`${apiUrl}/contents`);
  },


};
