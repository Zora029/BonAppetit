import { Navbar } from '@material-tailwind/react';
import NotificationsMenu from '../menu/NotificationsMenu';
import ProfileMenu from '../menu/ProfileMenu';

const AdminNavbar = () => {
  return (
    <Navbar
      color="transparent"
      shadow={false}
      blurred={true}
      className="mx-auto flex max-w-none justify-end px-6"
    >
      <div className="flex gap-2">
        <NotificationsMenu />
        <ProfileMenu />
      </div>
    </Navbar>
  );
};

export default AdminNavbar;
