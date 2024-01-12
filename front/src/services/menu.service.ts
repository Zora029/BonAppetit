import { IMenuFormData } from '@/types';
import http from '../http-common';

const MenuService = {
  getWeekMenuForClient: (date: string) => {
    return http.get(`/menu/client/week-menu/${date}`);
  },

  getWeekMenuForAdmin: (date: string) => {
    return http.get(`/menu/admin/week-menu/${date}`);
  },

  getOneWithCommande: (id: string) => {
    return http.get(`/menu/client/${id}`);
  },

  getOne: (id: string) => {
    return http.get(`/menu/${id}`);
  },

  createOne: (data: IMenuFormData) => {
    return http.post('/menu/', data);
  },

  updateOne: (id: string, data: IMenuFormData) => {
    return http.put(`/menu/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/menu/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/menu/${id}`);
  },
};

export default MenuService;
