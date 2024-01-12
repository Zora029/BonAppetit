import { SyntheticEvent, useState } from 'react';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Select,
  Option,
} from '@material-tailwind/react';
import { Calendar } from 'primereact/calendar';
import { FormEvent } from 'primereact/ts-helpers';

import { IIndisponibilitesFormData } from '@/types';
import { formatDates, getDates } from '@/utils';

interface IAjoutIndisponibiliteDialogProps {
  open: boolean;
  utilisateursMatricule: string[];
  handleOpen: () => void;
  onSubmit: (indisponibilite: IIndisponibilitesFormData) => void;
}

const AjoutIndisponibiliteDialog: React.FC<
  IAjoutIndisponibiliteDialogProps
> = ({ open, handleOpen, onSubmit, utilisateursMatricule }) => {
  const emptyFormData: IIndisponibilitesFormData = {
    date_ind: [],
    matricule_utilisateur: '',
  };
  const matriculeOptions = ['Rien', ...utilisateursMatricule];

  const [formData, setformData] =
    useState<IIndisponibilitesFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return formData.date_ind.length < 1;
  };

  const handleSelectChange = (value: string) => {
    setformData({
      ...formData,
      matricule_utilisateur: value != 'Rien' ? value : '',
    });
  };

  const handleDateChange = (
    event: FormEvent<Date[], SyntheticEvent<Element, Event>>,
  ) => {
    if (event.value) {
      setformData({ ...formData, date_ind: getDates(event.value) });
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    setformData(emptyFormData);
  };
  return (
    <Dialog size="md" open={open} handler={handleOpen}>
      <DialogHeader>Ajout indisponibilite</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
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
        <Calendar
          value={formatDates(formData.date_ind)}
          onChange={handleDateChange}
          selectionMode="multiple"
          readOnlyInput
          inline
          showWeek
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

export default AjoutIndisponibiliteDialog;
