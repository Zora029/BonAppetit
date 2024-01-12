import { useState } from 'react';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Select,
  Option,
  Typography,
} from '@material-tailwind/react';
import { INotificationsFormData } from '@/types';

interface IAjoutNotificationDialogProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (notification: INotificationsFormData) => void;
}

const AjoutNotificationDialog: React.FC<IAjoutNotificationDialogProps> = ({
  open,
  handleOpen,
  onSubmit,
}) => {
  const emptyFormData: INotificationsFormData = {
    contenu_notification: '',
    lien_notification: '/menu/',
    date_lien: '',
    type_notification: 'nouveau menu',
    destinataire_notification: 'global',
  };
  const types = ['nouveau menu', 'rappel'];

  const [formData, setformData] =
    useState<INotificationsFormData>(emptyFormData);

  const disableAjout = (): boolean => {
    return (
      !formData.contenu_notification ||
      (formData.type_notification == 'nouveau menu' && !formData.date_lien)
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == 'date_lien') {
      setformData({
        ...formData,
        [name]: value,
        lien_notification: `/menu/${value}`,
      });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };

  const handleTypeChange = (value: string) => {
    setformData({ ...formData, type_notification: value });
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
      <DialogHeader>Ajout notification</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Input
          variant="outlined"
          label="Destination"
          name="destinataire_notification"
          value={formData.destinataire_notification}
          onChange={handleInputChange}
          crossOrigin={undefined}
          disabled
        />
        <Select
          name="type_notification"
          value={formData.type_notification}
          onChange={(val) => val && handleTypeChange(val)}
          variant="outlined"
          label="Type notification"
        >
          {types.map((valeur, index) => (
            <Option key={index} value={valeur}>
              {valeur}
            </Option>
          ))}
        </Select>
        <Input
          type="date"
          label="Date Lien"
          name="date_lien"
          value={formData.date_lien}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Contenue notification"
          name="contenu_notification"
          value={formData.contenu_notification}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Typography className="text-center text-sm">
          Remarque: Un rappel peut ne pas avoir besoin de date lien
        </Typography>
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

export default AjoutNotificationDialog;
