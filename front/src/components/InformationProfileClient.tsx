import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { IconButton } from '@material-tailwind/react';

import EditPreferencesDialog from './dialog/EditPreferencesDialog';

import { IIngredient, IPreference, IUtilisateur } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import UtilisateurService from '@/services/utilisateur.service';
import IngredientService from '@/services/ingredient.service';

interface IInformationProfileClientProps {
  user: IUtilisateur;
}

const InformationProfileClient: React.FC<IInformationProfileClientProps> = ({
  user,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [preferences, setpreferences] = useState<IPreference>({
    matricule_utilisateur: user.matricule_utilisateur,
    preferences: [],
    restrictions: [],
  });
  const [ingredientsOptions, setingredientsOptions] = useState<IIngredient[]>(
    [],
  );
  const [isPreferencesDialogOpen, setisPreferencesDialogOpen] =
    useState<boolean>(false);

  // Mounted
  useEffect(() => {
    retrievePreferences();
    retrieveDatas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrievePreferences = async () => {
    try {
      const res = await UtilisateurService.getPreferences();
      setpreferences(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      const res1 = await IngredientService.getAll();
      setingredientsOptions(res1.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Handler
  const handleEditPreferences = async (pref: IPreference) => {
    try {
      await UtilisateurService.updatePreferences(pref);
      setisPreferencesDialogOpen(false);

      retrievePreferences();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  return (
    <div className="w-full max-w-full px-3 lg-max:mt-6 xl:w-4/12">
      <div className="relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border shadow-soft-xl">
        <div className="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
          <div className="-mx-3 flex flex-row items-center justify-between">
            <div className="flex w-full max-w-full shrink-0 items-center px-3 md:w-8/12 md:flex-none">
              <h6 className="mb-0 font-semibold">Informations de profil</h6>
            </div>
          </div>
        </div>
        <div className="flex-auto p-4">
          <ul className="mb-0 flex flex-col rounded-lg pl-0">
            <li className="relative block rounded-t-lg border-0 bg-white px-4 py-1 pl-0 pt-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">Matricule:</strong> &nbsp;
              {user.matricule_utilisateur}
            </li>
            <li className="relative block rounded-t-lg border-0 bg-white px-4 py-1 pl-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">Nom Complet:</strong> &nbsp;
              {user.nom_utilisateur + ' ' + user.prenom_utilisateur}
            </li>
            <li className="relative block border-0 border-t-0 bg-white px-4 py-1 pl-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">Poste:</strong> &nbsp;
              {user.poste_utilisateur}
            </li>
            <li className="relative block border-0 border-t-0 bg-white px-4 py-1 pl-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">Tel:</strong> &nbsp;{' '}
              {user.tel_utilisateur}
            </li>
            <li className="relative block border-0 border-t-0 bg-white px-4 py-1 pb-0 pl-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">E-mail:</strong> &nbsp;
              {user.email_utilisateur}
            </li>
          </ul>
          <hr className="mb-3 mt-6 h-px bg-transparent bg-gradient-to-r from-transparent via-white to-transparent" />
          <div className="-mx-3 flex flex-row items-center justify-between">
            <div className="flex w-full max-w-full shrink-0 items-center px-3 md:w-8/12 md:flex-none">
              <h5 className="mb-0 font-semibold">Préférences</h5>
            </div>
            <IconButton
              variant="text"
              onClick={() => setisPreferencesDialogOpen(true)}
            >
              <PencilSquareIcon className="h-5 w-5 text-body" />
            </IconButton>
          </div>
          <ul className="mb-0 flex flex-col rounded-lg pl-0">
            <li className="relative block rounded-t-lg border-0 bg-white px-4 py-1 pl-0 pt-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">
                Préférences alimentaires:
              </strong>{' '}
              &nbsp;{' '}
              {preferences.preferences.length
                ? preferences.preferences
                    .map((pref) => pref.nom_ingredient)
                    .join(', ')
                : 'Aucune...'}
            </li>
            <li className="relative block border-0 border-t-0 bg-white px-4 py-1 pl-0 text-sm leading-normal text-inherit">
              <strong className="text-slate-700">
                Restrictions alimentaires:
              </strong>{' '}
              &nbsp;{' '}
              {preferences.restrictions.length
                ? preferences.restrictions
                    .map((pref) => pref.nom_ingredient)
                    .join(', ')
                : 'Aucune...'}
            </li>
          </ul>
        </div>
      </div>
      <EditPreferencesDialog
        open={isPreferencesDialogOpen}
        handleOpen={() => setisPreferencesDialogOpen(!isPreferencesDialogOpen)}
        ingredientsOptions={ingredientsOptions}
        preferences={preferences}
        onEdit={handleEditPreferences}
      />
    </div>
  );
};

export default InformationProfileClient;
