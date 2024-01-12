import { useState } from 'react';

import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Typography,
  Select,
  Option,
} from '@material-tailwind/react';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';

import { ICantinesFormData } from '@/types';
import { isDateBefore } from '@/utils';

interface IAjoutCantineDialogProps {
  open: boolean;
  utilisateursMatricule: string[];
  handleOpen: () => void;
  onSubmit: (cantine: ICantinesFormData) => void;
}

const AjoutCantineDialog: React.FC<IAjoutCantineDialogProps> = ({
  open,
  utilisateursMatricule,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: ICantinesFormData = {
    nom_cantine: '',
    type_contrat: '',
    debut_contrat: '',
    fin_contrat: '',
    nombre_repas: 0,
    actif: false,
    matricule_utilisateur: '',
  };
  const matriculeOptions = [...utilisateursMatricule];

  const [formData, setformData] = useState<ICantinesFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return !(
      formData.nom_cantine &&
      formData.type_contrat &&
      formData.nombre_repas &&
      formData.debut_contrat &&
      formData.fin_contrat &&
      formData.matricule_utilisateur
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == 'nombre_repas') {
      const nb = parseInt(value.replace(/\D/g, ''));
      setformData({ ...formData, nombre_repas: nb });
    } else if (name == 'debut_contrat') {
      (!formData.fin_contrat || isDateBefore(value, formData.fin_contrat)) &&
        setformData({ ...formData, [name]: value });
    } else if (name == 'fin_contrat') {
      (!formData.debut_contrat ||
        isDateBefore(formData.debut_contrat, value)) &&
        setformData({ ...formData, [name]: value });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (event: InputSwitchChangeEvent) => {
    setformData({ ...formData, actif: event.value });
  };

  const handleSelectChange = (value: string) => {
    setformData({
      ...formData,
      matricule_utilisateur: value,
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setformData(emptyFormData);
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };
  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout cantine</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Input
          variant="outlined"
          label="Nom"
          name="nom_cantine"
          value={formData.nom_cantine}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Type Contrat"
          name="type_contrat"
          value={formData.type_contrat}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          type="date"
          label="Debut Contrat"
          name="debut_contrat"
          value={formData.debut_contrat}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          type="date"
          label="Fin Contrat"
          name="fin_contrat"
          value={formData.fin_contrat}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          type="text"
          variant="outlined"
          label="Nombre repas"
          name="nombre_repas"
          value={formData.nombre_repas}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Select
          name="matricule_utilisateur"
          value={formData.matricule_utilisateur}
          onChange={(val) => val && handleSelectChange(val)}
          variant="outlined"
          label="Matricule"
        >
          {matriculeOptions.map((valeur, index) => (
            <Option key={index} value={valeur}>
              {valeur}
            </Option>
          ))}
        </Select>
        <div className="mx-auto flex gap-2">
          <Typography className="text-sm">Active</Typography>
          <InputSwitch checked={formData.actif} onChange={handleSwitchChange} />
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

export default AjoutCantineDialog;
