import React, { useState } from 'react';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';
import { IIngredientsFormData } from '@/types';

interface IAjoutIngredientDialogProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (ingredient: IIngredientsFormData) => void;
}

const AjoutIngredientDialog: React.FC<IAjoutIngredientDialogProps> = ({
  open,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: IIngredientsFormData = {
    nom_ingredient: '',
  };

  const [formData, setformData] = useState<IIngredientsFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return formData.nom_ingredient == '';
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setformData(emptyFormData);
  };
  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout ingredient</DialogHeader>
      <DialogBody>
        <Input
          variant="outlined"
          label="Nom ingredient"
          name="nom_ingredient"
          value={formData.nom_ingredient}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue-gray"
          onClick={handleOpen}
          className="mr-1"
        >
          <span>Annuler</span>
        </Button>
        <Button
          variant="gradient"
          color="green"
          onClick={handleSubmit}
          disabled={disableAjout()}
        >
          <span>Ajouter</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AjoutIngredientDialog;
