import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';

import { ICommandeFormData } from '@/types';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { etatsCommande } from '@/database';

interface IAjoutCommandeDialogProps {
  open: boolean;
  utilisateursMatricule: string[];
  handleOpen: () => void;
  onSubmit: (commande: ICommandeFormData, matricule: string) => void;
}

const AjoutCommandeDialog: React.FC<IAjoutCommandeDialogProps> = ({
  open,
  utilisateursMatricule,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: ICommandeFormData = {
    date_menu: '',
    code_commande: '',
    etat_commande: 'commandée',
  };

  const [formData, setformData] = useState<ICommandeFormData>(emptyFormData);
  const [selectedMatricule, setselectedMatricule] = useState<string>('');

  const disableAjout = (): boolean => {
    return !(formData.date_menu && formData.code_commande && selectedMatricule);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSelectMatricule = (event: DropdownChangeEvent) => {
    setselectedMatricule(event.target.value);
  };

  const handleSelectEtat = (event: DropdownChangeEvent) => {
    setformData({ ...formData, etat_commande: event.target.value });
  };

  const handleSubmit = () => {
    onSubmit(formData, selectedMatricule);
    setformData(emptyFormData);
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };
  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout commande</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Dropdown
          value={selectedMatricule}
          onChange={handleSelectMatricule}
          options={utilisateursMatricule}
          filter
          placeholder="Selectionner le matricule"
          className="border border-body"
          panelClassName="!z-[10000]"
        />
        <Input
          type="date"
          label="Date du menu"
          name="date_menu"
          value={
            typeof formData.date_menu == 'string'
              ? formData.date_menu
              : formData.date_menu?.toISOString()
          }
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Code commande"
          name="code_commande"
          value={formData.code_commande}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Dropdown
          value={formData.etat_commande}
          onChange={handleSelectEtat}
          options={etatsCommande}
          filter
          placeholder="Selectionner un état"
          className="border border-body"
          panelClassName="!z-[10000]"
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

export default AjoutCommandeDialog;
