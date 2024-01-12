import { useEffect, useState } from 'react';

import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';

import { IIngredient, IPreference } from '@/types';

interface IEditPreferencesDialogProps {
  open: boolean;
  handleOpen: () => void;
  preferences: IPreference;
  ingredientsOptions: IIngredient[];
  onEdit: (pref: IPreference) => void;
}

const EditPreferencesDialog: React.FC<IEditPreferencesDialogProps> = ({
  open,
  handleOpen,
  preferences,
  ingredientsOptions,
  onEdit,
}) => {
  const [formData, setformData] = useState<IPreference>(preferences);

  // Handler
  const handleSelectPreferences = (e: MultiSelectChangeEvent) => {
    setformData({ ...formData, preferences: e.value });
  };

  const handleSelectRestrictions = (e: MultiSelectChangeEvent) => {
    setformData({ ...formData, restrictions: e.value });
  };

  const handleEdit = () => {
    onEdit(formData);
  };

  const handleAnnuler = () => {
    handleOpen();
  };

  useEffect(() => {
    setformData(preferences);
  }, [preferences]);

  return (
    <Dialog size="md" open={open} handler={handleOpen}>
      <DialogHeader>Modification des Préférences</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 text-body">
          <h5 className="text-lg">Préférences alimentaires :</h5>
          <div className="rounded-2xl border p-4">
            <MultiSelect
              value={formData.preferences}
              onChange={handleSelectPreferences}
              options={ingredientsOptions}
              optionLabel="nom_ingredient"
              display="chip"
              filter
              placeholder="Sélectionnez les préférences alimentaires..."
              className="w-full"
              panelClassName="!z-[10000]"
            />
          </div>
          <h5 className="text-lg">Restrictions alimentaires :</h5>
          <div className="rounded-2xl border p-4">
            <MultiSelect
              value={formData.restrictions}
              onChange={handleSelectRestrictions}
              options={ingredientsOptions}
              optionLabel="nom_ingredient"
              display="chip"
              filter
              placeholder="Sélectionnez les restrictions alimentaires..."
              className="w-full"
              panelClassName="!z-[10000]"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={handleAnnuler}
          className="mr-1"
        >
          <span>Annuler</span>
        </Button>
        <Button onClick={handleEdit} className="max-w-xs">
          Valider les modifications
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default EditPreferencesDialog;
