import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

import {
  Navbar,
  Typography,
  IconButton,
  Collapse,
  Button,
} from '@material-tailwind/react';
import { Bars2Icon } from '@heroicons/react/24/outline';
import { getDateNow } from '@/utils';

import ProfileMenu from '../menu/ProfileMenu';
import NotificationsMenu from '../menu/NotificationsMenu';

function NavList() {
  const now = getDateNow();
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <NavLink
          to="/"
          className={({ isActive }) =>
            'flex items-center transition-colors hover:text-primary ' +
            (isActive && '!text-primary')
          }
        >
          Acceuil
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <NavLink
          to={`/menu/${now}`}
          className={({ isActive }) =>
            'flex items-center transition-colors hover:text-primary ' +
            (isActive && '!text-primary')
          }
        >
          Menu
        </NavLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <NavLink
          to="/plats-complement"
          className={({ isActive }) =>
            'flex items-center transition-colors hover:text-primary ' +
            (isActive && '!text-primary')
          }
        >
          Plats & Complements
        </NavLink>
      </Typography>
      <NavLink to="/menu/">
        <Button variant="filled" className="rounded-full bg-primary">
          Commander
        </Button>
      </NavLink>
    </ul>
  );
}

export default function ClientNavbar() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  useEffect(() => {
    window.addEventListener(
      'resize',
      () => window.innerWidth >= 960 && setIsNavOpen(false),
    );
  }, []);

  return (
    <Navbar
      color="transparent"
      shadow={false}
      blurred={true}
      className="mx-auto max-w-screen-2xl bg-bg bg-opacity-100 p-2 lg:rounded-full lg:pl-6"
    >
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="ml-2 mr-4 cursor-pointer py-1.5 font-hero font-medium text-secondary"
        >
          BonAppetit
        </Typography>
        <div className="absolute left-2/4 top-2/4 hidden -translate-x-2/4 -translate-y-2/4 lg:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 lg:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
        <div className="ml-auto flex gap-2">
          <NotificationsMenu />
          <ProfileMenu />
        </div>
      </div>
      <Collapse open={isNavOpen}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}
