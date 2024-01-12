import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import {
//   CakeIcon,
//   ClipboardDocumentListIcon,
//   IdentificationIcon,
//   UserGroupIcon,
// } from '@heroicons/react/24/solid';

// import DashboardCard from '@/components/card/DashboardCard';
import RapportCard from '@/components/card/RapportCard';
import CantineOverviewTable from '@/components/table/CantineOverviewTable';

import { ICantineOverviewTableData } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import OverviewService from '@/services/overview.service';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cantineTableData, setcantineTableData] = useState<
    ICantineOverviewTableData[]
  >([]);

  // Mounted
  useEffect(() => {
    retrieveDatas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveDatas = async () => {
    try {
      OverviewService.getCantineOverview().then((res) => {
        setcantineTableData(res.data);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };
  return (
    <>
      {/* <div className="mb-6 flex flex-wrap">
        <DashboardCard
          nom="Nb Utilisateurs"
          valeur={150}
          icon={<UserGroupIcon className="h-5 w-5 text-white" />}
        />
        <DashboardCard
          nom="Nb Commandes"
          valeur={150}
          icon={<IdentificationIcon className="h-5 w-5 text-white" />}
        />
        <DashboardCard
          nom="Plats Disponibles"
          valeur={150}
          icon={<CakeIcon className="h-5 w-5 text-white" />}
        />
        <DashboardCard
          nom="Nb Menus"
          valeur={150}
          icon={<ClipboardDocumentListIcon className="h-5 w-5 text-white" />}
        />
      </div> */}

      <div className="mt-6 flex flex-wrap">
        <div className="mb-6 mt-0 w-full max-w-full px-3 lg:mb-0 lg:w-5/12 lg:flex-none">
          <RapportCard />
        </div>
        <div className="mt-0 w-full max-w-full px-3 lg:w-7/12 lg:flex-none">
          <div className="h-full w-full rounded-2xl bg-[url(/src/assets/img/acceuil_hero.png)] bg-cover bg-center shadow-soft-xl">
            <h1 className="p-10 font-hero text-6xl font-bold text-body">
              Bon Appetit !
            </h1>
          </div>
        </div>
      </div>

      <div className="my-6 px-3">
        <CantineOverviewTable data={cantineTableData} />
      </div>
    </>
  );
};

export default AdminDashboard;
