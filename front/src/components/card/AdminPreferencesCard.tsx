import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from '@material-tailwind/react';

import { IIngredient, IPreference, IUtilisateur } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import UtilisateurService from '@/services/utilisateur.service';
import { errorHandler, successHandler } from '@/utils';
import IngredientService from '@/services/ingredient.service';

interface IAdminPreferencesCardProps {
  utilisateursOptions: IUtilisateur[];
}

const AdminPreferencesCard: React.FC<IAdminPreferencesCardProps> = ({
  utilisateursOptions,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [preferences, setpreferences] = useState<IPreference>({
    matricule_utilisateur: '',
    preferences: [],
    restrictions: [],
  });
  const [ingredientsOptions, setingredientsOptions] = useState<IIngredient[]>(
    [],
  );

  // Mounted
  useEffect(() => {
    retrievePreferences();
    retrieveDatas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrievePreferences = async (id?: string) => {
    try {
      const res = await UtilisateurService.getPreferences(id);
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
  const handleEditPreferences = async () => {
    try {
      const res = await UtilisateurService.updatePreferences(
        preferences,
        preferences.matricule_utilisateur,
      );

      retrievePreferences(preferences.matricule_utilisateur);
      successHandler(res, showToast);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleSelectMatriculeChange = (event: DropdownChangeEvent) => {
    retrievePreferences(event.value);
  };

  const handleSelectPreferences = (e: MultiSelectChangeEvent) => {
    setpreferences({ ...preferences, preferences: e.value });
  };

  const handleSelectRestrictions = (e: MultiSelectChangeEvent) => {
    setpreferences({ ...preferences, restrictions: e.value });
  };

  return (
    <div className="h-full w-full rounded-2xl bg-white p-4 shadow-soft-xl">
      <div className="mx-auto max-w-max">
        <Dropdown
          value={preferences.matricule_utilisateur}
          onChange={handleSelectMatriculeChange}
          options={utilisateursOptions}
          optionLabel="matricule_utilisateur"
          optionValue="matricule_utilisateur"
          filter
          placeholder="Selectionner le matricule"
          className="border border-body"
        />
      </div>
      <div className="flex flex-col gap-4 text-body">
        <h5 className="text-lg">Préférences alimentaires :</h5>
        <div className="rounded-2xl border p-4">
          <MultiSelect
            value={preferences.preferences}
            onChange={handleSelectPreferences}
            options={ingredientsOptions}
            optionLabel="nom_ingredient"
            display="chip"
            filter
            placeholder="Sélectionnez les préférences alimentaires..."
            className="w-full"
          />
        </div>
        <h5 className="text-lg">Restrictions alimentaires :</h5>
        <div className="rounded-2xl border p-4">
          <MultiSelect
            value={preferences.restrictions}
            onChange={handleSelectRestrictions}
            options={ingredientsOptions}
            optionLabel="nom_ingredient"
            display="chip"
            filter
            placeholder="Sélectionnez les restrictions alimentaires..."
            className="w-full"
          />
        </div>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Button onClick={handleEditPreferences} className="max-w-xs">
          Valider les modifications
        </Button>
      </div>
    </div>
  );
};

export default AdminPreferencesCard;
