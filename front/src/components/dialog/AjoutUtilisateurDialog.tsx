import { useState } from 'react';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';

import { IUtilisateurFormData } from '@/types';
import { roleOptions } from '@/database';

interface IAjoutUtilisateurDialogProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (user: IUtilisateurFormData) => void;
}

const AjoutUtilisateurDialog: React.FC<IAjoutUtilisateurDialogProps> = ({
  open,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: IUtilisateurFormData = {
    matricule_utilisateur: '',
    nom_utilisateur: '',
    prenom_utilisateur: '',
    email_utilisateur: '',
    tel_utilisateur: '',
    poste_utilisateur: '',
    role_utilisateur: 'user',
    file: undefined,
    mot_de_passe: '',
  };

  const [formData, setformData] = useState<IUtilisateurFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return !(
      formData.matricule_utilisateur &&
      formData.mot_de_passe &&
      formData.role_utilisateur
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name == 'file') {
      setformData({ ...formData, file: files ? files[0] : null });
    } else {
      setformData({ ...formData, [name]: value ? value : null });
    }
  };

  const handleSelectRole = (event: DropdownChangeEvent) => {
    setformData({
      ...formData,
      role_utilisateur: event.target.value,
    });
  };

  const handleAdd = () => {
    onSubmit(formData);
    setformData(emptyFormData);
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };

  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout Utilisateur</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Input
          variant="outlined"
          label="Matricule"
          name="matricule_utilisateur"
          value={formData.matricule_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Mot de passe"
          name="mot_de_passe"
          value={formData.mot_de_passe}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Poste"
          name="poste_utilisateur"
          value={formData.poste_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Nom"
          name="nom_utilisateur"
          value={formData.nom_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Prenom"
          name="prenom_utilisateur"
          value={formData.prenom_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="E-mail"
          name="email_utilisateur"
          value={formData.email_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Tel"
          name="tel_utilisateur"
          value={formData.tel_utilisateur}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Dropdown
          value={formData.role_utilisateur}
          onChange={handleSelectRole}
          options={roleOptions}
          filter
          placeholder="Selectionner un rôle"
          className="border border-body"
          panelClassName="!z-[10000]"
        />
        <input type="file" name="file" onChange={handleInputChange} />
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
          onClick={handleAdd}
          disabled={disableAjout()}
        >
          <span>Ajouter</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default AjoutUtilisateurDialog;
