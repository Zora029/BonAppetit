import React, { useState } from 'react';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';
import { ICategoriesFormData } from '@/types';

interface IAjoutCategorieDialogProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (categorie: ICategoriesFormData) => void;
}

const AjoutCategorieDialog: React.FC<IAjoutCategorieDialogProps> = ({
  open,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: ICategoriesFormData = {
    nom_categorie: '',
    limite_categorie: 0,
  };

  const [formData, setformData] = useState<ICategoriesFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return formData.nom_categorie == '' || formData.limite_categorie < 1;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == 'limite_categorie') {
      const limite = parseInt(value.replace(/\D/g, ''));
      setformData({ ...formData, limite_categorie: limite });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setformData(emptyFormData);
  };
  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout categorie</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <Input
          variant="outlined"
          label="Nom categorie"
          name="nom_categorie"
          value={formData.nom_categorie}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          type="text"
          variant="outlined"
          label="Limite categorie"
          name="limite_categorie"
          value={formData.limite_categorie}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
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

export default AjoutCategorieDialog;
