import { Card } from '@material-tailwind/react';
import {
  BellIcon,
  BuildingStorefrontIcon,
  CakeIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  IdentificationIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import logo from '@/assets/img/logo.png';
import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  return (
    <Card className="m-4 h-[calc(100vh-2rem)] w-full max-w-[16rem] bg-transparent p-0 shadow-none">
      <div className="flex items-center gap-4 px-8 py-6">
        <img src={logo} className="h-8 w-8" alt="main_logo" />
        <h1 className="font-semibol font-hero text-lg">Bon Appetit</h1>
      </div>
      <hr className="mb-4 mt-0 text-blue-gray-100" />
      <ul className="flex flex-col">
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <ChartBarIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Dashboard</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/menus"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <ClipboardDocumentListIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Menus</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/plats-complement"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <CakeIcon className={`h-4 w-4 ${isActive && 'text-white'}`} />
                </div>
                <span className="ml-1">Plats & Compléments</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/commandes"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <IdentificationIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Commandes</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/utilisateurs"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <UserGroupIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Utilisateurs</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/cantines"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <BuildingStorefrontIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Cantines</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/notifications"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <BellIcon className={`h-4 w-4 ${isActive && 'text-white'}`} />
                </div>
                <span className="ml-1">Notifications</span>
              </>
            )}
          </NavLink>
        </li>
        <li className="mt-0.5 w-full">
          <NavLink
            to="/admin/parametres"
            className={({ isActive }) =>
              'mx-3 my-0 flex items-center whitespace-nowrap rounded-lg  px-4 py-3 text-sm transition-colors duration-300 ' +
              (isActive && '!bg-white font-semibold shadow-soft-xl')
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white bg-center stroke-0 p-2.5 text-center shadow-soft-2xl ${
                    isActive && '!bg-primary'
                  }`}
                >
                  <Cog6ToothIcon
                    className={`h-4 w-4 ${isActive && 'text-white'}`}
                  />
                </div>
                <span className="ml-1">Paramètres</span>
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </Card>
  );
};

export default AdminSidebar;
