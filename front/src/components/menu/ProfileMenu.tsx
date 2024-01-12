import { createElement, useEffect, useState } from 'react';

import {
  ChartBarIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  InboxArrowDownIcon,
  PowerIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from '@material-tailwind/react';
import { NavLink, useNavigate } from 'react-router-dom';
import ProfilePicture from '@/assets/img/profil.jpg';

import { useAuth } from '@/contexts/AuthContext';
import { IUtilisateur } from '@/types';
import UtilisateurService from '@/services/utilisateur.service';
import { arrayBufferToBase64, errorHandler } from '@/utils';

const profileMenuItems = [
  {
    label: 'Profile',
    icon: UserCircleIcon,
    link: '/profile',
  },
  {
    label: 'Dashboard',
    icon: ChartBarIcon,
    link: '/admin/',
    adminOnly: true,
  },
  {
    label: 'Dashboard',
    icon: ChartBarIcon,
    link: '/cantine/',
    cantineOnly: true,
  },
  {
    label: 'Modifier Profile',
    icon: Cog6ToothIcon,
    link: '/profile',
  },
  {
    label: 'Notifications',
    icon: InboxArrowDownIcon,
    link: '/profile',
  },
];

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [utilisateur, setutilisateur] = useState<IUtilisateur>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mounted
  useEffect(() => {
    retrieveUtilisateur();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveUtilisateur = async () => {
    try {
      const res = await UtilisateurService.getPersonalInformation();
      setutilisateur(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, undefined, navigate);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  const onLogout = () => {
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center gap-1 rounded-full py-0.5 pl-0.5 pr-2 lg:ml-auto"
        >
          <Avatar
            variant="circular"
            size="sm"
            alt="profile"
            className="border border-gray-900 p-0.5"
            src={
              utilisateur?.profil_utilisateur
                ? `data:image/*;base64,${arrayBufferToBase64(
                    utilisateur?.profil_utilisateur.data,
                  )}`
                : ProfilePicture
            }
          />
          <ChevronDownIcon
            strokeWidth={2.5}
            className={`h-3 w-3 transition-transform ${
              isMenuOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(
          ({ label, icon, link, adminOnly, cantineOnly }, key) => {
            if (adminOnly) {
              if (user.role != 'admin') {
                return;
              }
            }
            if (cantineOnly) {
              if (user.role != 'cantine') {
                return;
              }
            }
            return (
              <NavLink to={link} key={key}>
                <MenuItem
                  key={label}
                  onClick={closeMenu}
                  className={`flex items-center gap-2 rounded`}
                >
                  {createElement(icon, {
                    className: `h-4 w-4`,
                    strokeWidth: 2,
                  })}
                  <Typography
                    as="span"
                    variant="small"
                    className="font-normal"
                    color="inherit"
                  >
                    {label}
                  </Typography>
                </MenuItem>
              </NavLink>
            );
          },
        )}
        <MenuItem
          onClick={onLogout}
          className={`flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10`}
        >
          {createElement(PowerIcon, {
            className: `h-4 w-4 text-red-500`,
            strokeWidth: 2,
          })}
          <Typography
            as="span"
            variant="small"
            className="font-normal"
            color="red"
          >
            Déconnection
          </Typography>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
