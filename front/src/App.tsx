import { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Loader from './components/loader/Loader';

// Admin
import AdminLayout from './layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
const AdminMenus = lazy(() => import('./pages/admin/AdminMenus'));
const AdminPlatsComplements = lazy(
  () => import('./pages/admin/AdminPlatsComplements'),
);
const AdminCommandes = lazy(() => import('./pages/admin/AdminCommandes'));
const AdminUtilisateurs = lazy(() => import('./pages/admin/AdminUtilisateurs'));
const AdminCantines = lazy(() => import('./pages/admin/AdminCantines'));
const AdminNotifications = lazy(
  () => import('./pages/admin/AdminNotifications'),
);
const AdminParametres = lazy(() => import('./pages/admin/AdminParametres'));

// Client
import ClientLayout from './layout/ClientLayout';
import Acceuil from './pages/client/Acceuil';
const Menu = lazy(() => import('./pages/client/Menu'));
const PlatsComplements = lazy(() => import('./pages/client/PlatsComplements'));
const Profile = lazy(() => import('./pages/client/Profile'));

// Cantine
import CantineLayout from './layout/CantineLayout';
import CantineDashboard from './pages/cantine/CantineDashboard';
const CheckPoint = lazy(() => import('./pages/cantine/CheckPoint'));

import Login from './pages/Login';

const ServerError = lazy(() => import('./pages/ServerError'));

import Test from './pages/Test';
import { ProtectedRoute } from './routes/ProtectedRoute';
import AuthProvider from './contexts/AuthProvider';
import ToastProvider from './contexts/ToastProvider';

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        {loading ? (
          <Loader />
        ) : (
          <Routes>
            <Route
              element={<ProtectedRoute role={['user', 'cantine', 'admin']} />}
            >
              <Route element={<ClientLayout />}>
                <Route index element={<Acceuil />} />
                <Route path="/menu">
                  <Route
                    index
                    element={
                      <Suspense fallback={<Loader />}>
                        <Menu />
                      </Suspense>
                    }
                  />
                  <Route
                    path=":date"
                    element={
                      <Suspense fallback={<Loader />}>
                        <Menu />
                      </Suspense>
                    }
                  />
                </Route>
                <Route
                  path="/plats-complement"
                  element={
                    <Suspense fallback={<Loader />}>
                      <PlatsComplements />
                    </Suspense>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <Suspense fallback={<Loader />}>
                      <Profile />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            <Route element={<ProtectedRoute role={['cantine', 'admin']} />}>
              <Route path="/cantine" element={<CantineLayout />}>
                <Route index element={<CantineDashboard />} />
                <Route
                  path="menus"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminMenus />
                    </Suspense>
                  }
                />
                <Route
                  path="plats-complement"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminPlatsComplements />
                    </Suspense>
                  }
                />
              </Route>
              <Route path="/checkpoint" element={<CheckPoint />} />
            </Route>

            <Route element={<ProtectedRoute role={['admin']} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route
                  path="menus"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminMenus />
                    </Suspense>
                  }
                />
                <Route
                  path="plats-complement"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminPlatsComplements />
                    </Suspense>
                  }
                />
                <Route
                  path="commandes"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminCommandes />
                    </Suspense>
                  }
                />
                <Route
                  path="utilisateurs"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminUtilisateurs />
                    </Suspense>
                  }
                />
                <Route
                  path="cantines"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminCantines />
                    </Suspense>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminNotifications />
                    </Suspense>
                  }
                />
                <Route
                  path="parametres"
                  element={
                    <Suspense fallback={<Loader />}>
                      <AdminParametres />
                    </Suspense>
                  }
                />
              </Route>
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        )}
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
