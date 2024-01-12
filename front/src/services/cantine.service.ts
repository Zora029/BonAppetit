import { ICantine, ICantinesFormData } from '@/types';
import http from '../http-common';

const CantineService = {
  getAll: () => {
    return http.get('/cantine/');
  },

  getOne: (id: string) => {
    return http.get(`/cantine/${id}`);
  },

  createOne: (data: ICantinesFormData) => {
    return http.post('/cantine/', data);
  },

  updateOne: (id: string, data: ICantine) => {
    return http.put(`/cantine/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/cantine/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/cantine/${id}`);
  },
};

export default CantineService;
