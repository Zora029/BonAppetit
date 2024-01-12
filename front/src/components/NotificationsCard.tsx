import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { List, ListItem, Typography } from '@material-tailwind/react';
import { ClockIcon } from '@heroicons/react/24/outline';

import { errorHandler, getDate } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import { INotification } from '@/types';
import NotificationService from '@/services/notification.service';

const NotificationsCard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      errorHandler(err, showToast, navigate);
    }
  };
  return (
    <div className="w-full max-w-full px-3 lg-max:mt-6 xl:w-4/12">
      <div className="relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-soft-xl">
        <div className="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
          <h6 className="mb-0 font-semibold">Notifications</h6>
        </div>
        <div className="flex-auto p-4">
          <List className="gap-0 p-0">
            {notifications.map((notif) => (
              <NavLink to={notif.lien_notification} key={notif.id_notification}>
                <ListItem
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
                </ListItem>
              </NavLink>
            ))}
          </List>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCard;
