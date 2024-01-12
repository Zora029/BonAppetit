import { Outlet } from 'react-router-dom';
import CantineNavbar from '@/components/navbar/CantineNavbar';
const CantineLayout = () => {
  return (
    <div className="h-screen w-full">
      {/* <!-- ===== Header Start ===== --> */}
      <header className="fixed top-1 z-50 w-full">
        <CantineNavbar />
      </header>
      {/* <!-- ===== Header End ===== --> */}

      {/* <!-- ===== Main Content Start ===== --> */}
      <main className="flex min-h-screen w-full items-stretch justify-center px-4 pb-4 pt-[75px] md:px-6 2xl:px-10">
        <Outlet />
      </main>
      {/* <!-- ===== Main Content End ===== --> */}
    </div>
  );
};

export default CantineLayout;
