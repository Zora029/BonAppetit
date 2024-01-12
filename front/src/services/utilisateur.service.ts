import { IPreference, IUtilisateur } from '@/types';
import http from '../http-common';

const UtilisateurService = {
  getPersonalInformation: () => {
    return http.get('/utilisateur/information');
  },

  adorerPlat: (id: string) => {
    return http.post(`/utilisateur/adorer/${id}`);
  },

  getPreferences: (id?: string) => {
    if (id) {
      return http.get(`/utilisateur/preferences/${id}`);
    } else {
      return http.get(`/utilisateur/preferences`);
    }
  },

  updatePreferences: (data: IPreference, id?: string) => {
    if (id) {
      return http.put(`/utilisateur/preferences/${id}`, data);
    } else {
      return http.put(`/utilisateur/preferences`, data);
    }
  },

  getAll: () => {
    return http.get('/utilisateur/all');
  },

  getAllIds: () => {
    return http.get('/utilisateur/all-ids');
  },

  getAllIdsByRole: (role: string) => {
    return http.get(`/utilisateur/all-ids/${role}`);
  },

  getOne: (id: string) => {
    return http.get(`/utilisateur/${id}`);
  },

  createOne: (data: FormData) => {
    return http.post('/utilisateur/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  updateOne: (id: string, data: IUtilisateur) => {
    return http.put(`/utilisateur/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/utilisateur/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/utilisateur/${id}`);
  },
};

export default UtilisateurService;
