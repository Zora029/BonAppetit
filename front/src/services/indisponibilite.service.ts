import { IIndisponibilite, IIndisponibilitesFormData } from '@/types';
import http from '../http-common';

const IndisponibiliteService = {
  getAll: () => {
    return http.get('/indisponibilite/');
  },

  getOne: (id: string) => {
    return http.get(`/indisponibilite/${id}`);
  },

  createMany: (data: IIndisponibilitesFormData) => {
    return http.post('/indisponibilite/create-many', data);
  },

  // createOne: (data: IIndisponibilitesFormData) => {
  //   return http.post('/indisponibilite/', data);
  // },

  updateOne: (id: string, data: IIndisponibilite) => {
    return http.put(`/indisponibilite/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/indisponibilite/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/indisponibilite/${id}`);
  },
};

export default IndisponibiliteService;
