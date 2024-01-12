import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Typography,
} from '@material-tailwind/react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { BellIcon } from '@heroicons/react/24/solid';

import { errorHandler, getDate } from '@/utils';
import { INotification } from '@/types';
import NotificationService from '@/services/notification.service';

const NotificationsMenu = () => {
  const navigate = useNavigate();

  const [notifications, setnotifications] = useState<INotification[]>([]);

  // Mounted
  useEffect(() => {
    retrieveNotifications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveNotifications = async () => {
    try {
      const res = await NotificationService.getPreview();
      setnotifications(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, undefined, navigate);
    }
  };

  return (
    <Menu>
      <MenuHandler>
        <IconButton variant="text" color="blue-gray">
          <BellIcon className="h-4 w-4" />
        </IconButton>
      </MenuHandler>
      <MenuList className="flex flex-col gap-2">
        {notifications.map((notif, index) => (
          <NavLink to={notif.lien_notification} key={index}>
            <MenuItem
              key={notif.id_notification}
              className="flex items-center justify-center gap-4 px-2 py-2"
            >
              <div className="flex flex-col gap-1">
                <Typography
                  variant="small"
                  color="gray"
                  className="font-normal"
                >
                  {notif.contenu_notification}
                </Typography>
                <Typography
                  variant="small"
                  className="flex items-center gap-1 text-xs text-gray-600"
                >
                  <ClockIcon className="h-3 w-3" />
                  {getDate(notif.date_notification)}
                </Typography>
              </div>
            </MenuItem>
          </NavLink>
        ))}
      </MenuList>
    </Menu>
  );
};

export default NotificationsMenu;
