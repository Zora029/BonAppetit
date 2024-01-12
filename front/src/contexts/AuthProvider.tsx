/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';
import http from '../http-common';

interface IAuthProviderProps {
  children: any;
}

const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [user, setUser_] = useState(
    JSON.parse(
      localStorage.getItem('user') ||
        '{"matricule": "","role": "user","accessToken": ""}',
    ),
  );

  const setUser = (newUser: any) => {
    setUser_(newUser);
  };

  useEffect(() => {
    if (user && user.accessToken) {
      http.defaults.headers.common['x-access-token'] = user.accessToken;
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      delete http.defaults.headers.common['x-access-token'];
      localStorage.removeItem('user');
    }
  }, [user]);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
    }),
    [user],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
