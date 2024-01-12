import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import IndisponibilitesCrudTable from '@/components/table/IndisponibiliteCrudTable';
import AdminPreferencesCard from '@/components/card/AdminPreferencesCard';
import UtilisateurCrudTable from '@/components/table/UtilisateurCrudTable';

import { IUtilisateur } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import UtilisateurService from '@/services/utilisateur.service';

const AdminUtilisateurs = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [utilisateurs, setutilisateurs] = useState<IUtilisateur[]>([]);

  // Mounted
  useEffect(() => {
    retrieveUtilisateurs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveUtilisateurs = async () => {
    try {
      const res = await UtilisateurService.getAll();
      setutilisateurs(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  return (
    <div>
      <div className="mt-6 flex flex-wrap">
        <div className="mb-6 mt-0 w-full max-w-full px-3 lg:mb-0 lg:w-1/2 lg:flex-none">
          <IndisponibilitesCrudTable listeUtilisateur={utilisateurs} />
        </div>
        <div className="mt-0 w-full max-w-full px-3 lg:w-1/2 lg:flex-none">
          <AdminPreferencesCard utilisateursOptions={utilisateurs} />
        </div>
      </div>
      <div className="my-6 px-3">
        <UtilisateurCrudTable updateListeUtilisateurs={setutilisateurs} />
      </div>
    </div>
  );
};

export default AdminUtilisateurs;
