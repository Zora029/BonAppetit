import { INotification, INotificationsFormData } from '@/types';
import http from '../http-common';

const NotificationService = {
  getAll: () => {
    return http.get('/notification/');
  },

  getOne: (id: string) => {
    return http.get(`/notification/${id}`);
  },

  getPreview: () => {
    return http.get(`/notification/preview`);
  },

  createOne: (data: INotificationsFormData) => {
    return http.post('/notification/', data);
  },

  updateOne: (id: string, data: INotification) => {
    return http.put(`/notification/${id}`, data);
  },

  deleteMany: (ids: string[]) => {
    return http.delete(`/notification/`, { data: ids });
  },

  deleteOne: (id: string) => {
    return http.delete(`/notification/${id}`);
  },
};

export default NotificationService;
