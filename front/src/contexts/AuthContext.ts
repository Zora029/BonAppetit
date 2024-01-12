import { createContext, useContext } from 'react';
import { IAuthContext } from '@/types';

const user = JSON.parse(
  localStorage.getItem('user') ||
    '{"matricule": "","role": "user","accessToken": ""}',
);

export const AuthContext = createContext<IAuthContext>({
  user: user,
  setUser: (user) => user,
});

export const useAuth = () => {
  return useContext(AuthContext);
};
