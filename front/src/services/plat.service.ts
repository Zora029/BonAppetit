import http from '../http-common';

const PlatService = {
  getAll: () => {
    return http.get('/plat/all');
  },

  getAllWithAdorer: () => {
    return http.get('/plat/all/with-adorer');
  },

  getAllPlatMenuOptions: () => {
    return http.get('/plat/all/plat-menu-options/');
  },

  getOne: (id: string) => {
    return http.get(`/plat/one/${id}`);
  },

  getOneWithAdorer: (id: string) => {
    return http.get(`/plat/one/with-adorer/${id}`);
  },

  createOne: (data: FormData) => {
    return http.post('/plat/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateOne: (id: string, data: FormData) => {
    return http.put(`/plat/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/plat/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/plat/${id}`);
  },
};

export default PlatService;
