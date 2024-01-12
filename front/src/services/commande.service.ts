import { ICommandeFormData } from '@/types';
import http from '../http-common';

const CommandeService = {
  generateDefaultChoicesForMenu: (id: string) => {
    return http.post(`/commande/generate-default-choices/${id}`);
  },

  getAllCommandesOfTheDayAPI: () => {
    return http.get('/commande/all-commandes-of-the-day');
  },

  getCommandListForWeeklyReport: (date: string) => {
    return http.get(`/commande/commande-list-for-weekly-report/${date}`);
  },

  getCommandCountForMonthlyReport: (date: string) => {
    return http.get(`/commande/commande-count-for-weekly-report/${date}`);
  },

  getAll: () => {
    return http.get('/commande/all/');
  },

  getOne: (id: string) => {
    return http.get(`/commande/one/${id}`);
  },

  createOne: (data: ICommandeFormData) => {
    return http.post('/commande/', data);
  },

  createOneForAdmin: (data: ICommandeFormData, matricule: string) => {
    return http.post(`/commande/${matricule}`, data);
  },

  updateOne: (id: string, data: ICommandeFormData) => {
    return http.put(`/commande/client-update/${id}`, data);
  },

  updateAllCommandeComToNPFromDate: (date: string) => {
    return http.put(
      `/commande/admin-update-all-commande-com-to-np-from-date/${date}`,
    );
  },

  takingCommandeForClient: (id: string) => {
    return http.put(`/commande/taking-commmand-for-client/${id}`);
  },

  updateOneForAdmin: (id: string, data: ICommandeFormData) => {
    return http.put(`/commande/admin-update/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/commande/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/commande/${id}`);
  },
};

export default CommandeService;
