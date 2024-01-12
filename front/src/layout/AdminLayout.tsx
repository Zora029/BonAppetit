import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/sidebar/AdminSidebar';
import AdminNavbar from '@/components/navbar/AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden text-body">
      {/* <!-- ===== Sidebar Start ===== --> */}
      <AdminSidebar />
      {/* <!-- ===== Sidebar End ===== --> */}

      {/* <!-- ===== Content Area Start ===== --> */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        {/* <!-- ===== Header Start ===== --> */}
        <AdminNavbar />
        {/* <!-- ===== Header End ===== --> */}

        {/* <!-- ===== Main Content Start ===== --> */}
        <main>
          <div className="mx-auto p-4 md:p-6">
            <Outlet />
          </div>
        </main>
        {/* <!-- ===== Main Content End ===== --> */}
      </div>
      {/* <!-- ===== Content Area End ===== --> */}
    </div>
  );
};

export default AdminLayout;
