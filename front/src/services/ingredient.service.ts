import { IIngredient, IIngredientsFormData } from '@/types';
import http from '../http-common';

const IngredientService = {
  getAll: () => {
    return http.get('/ingredient/');
  },

  getOne: (id: string) => {
    return http.get(`/ingredient/${id}`);
  },

  createOne: (data: IIngredientsFormData) => {
    return http.post('/ingredient/', data);
  },

  updateOne: (id: string, data: IIngredient) => {
    return http.put(`/ingredient/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/ingredient/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/ingredient/${id}`);
  },
};

export default IngredientService;
