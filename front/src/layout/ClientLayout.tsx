import { Outlet } from 'react-router-dom';
import ClientNavbar from '../components/navbar/ClientNavbar';

const ClientLayout = () => {
  return (
    <div className="h-screen w-full">
      {/* <!-- ===== Header Start ===== --> */}
      <header className="fixed top-1 z-50 w-full">
        <ClientNavbar />
      </header>
      {/* <!-- ===== Header End ===== --> */}

      {/* <!-- ===== Main Content Start ===== --> */}
      <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl items-start justify-center px-4 pt-[75px] md:px-6 2xl:px-10">
        <Outlet />
      </main>
      {/* <!-- ===== Main Content End ===== --> */}
    </div>
  );
};

export default ClientLayout;
