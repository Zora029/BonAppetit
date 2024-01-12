import { ILoginData, IUtilisateur } from '@/types';
import http from '../http-common';

const AuthService = {
  login: (data: ILoginData) => {
    return http.post('/auth/login', data);
  },

  register: (data: IUtilisateur) => {
    return http.post('/auth/signup', data);
  },
};

export default AuthService;
