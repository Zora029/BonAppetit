import { ICategorie, ICategoriesFormData } from '@/types';
import http from '../http-common';

const CategorieService = {
  getAll: () => {
    return http.get('/categorie/');
  },

  getOne: (id: string) => {
    return http.get(`/categorie/${id}`);
  },

  createOne: (data: ICategoriesFormData) => {
    return http.post('/categorie/', data);
  },

  updateOne: (id: string, data: ICategorie) => {
    return http.put(`/categorie/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/categorie/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/categorie/${id}`);
  },
};

export default CategorieService;
