import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { IRole } from '@/types';

interface IProtectedRouteProps {
  role: IRole[];
}

export const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ role }) => {
  const { user } = useAuth();

  if (!(user && user.accessToken && role.includes(user.role))) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
