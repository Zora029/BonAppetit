import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Input,
} from '@material-tailwind/react';

interface IRapportSelectDateDialogProps {
  open: boolean;
  handleOpen: () => void;
  onSubmit: (date: string) => void;
}

const RapportSelectDateDialog: React.FC<IRapportSelectDateDialogProps> = ({
  open,
  handleOpen,
  onSubmit,
}) => {
  const [date, setdate] = useState('');

  const disableAjout = (): boolean => {
    return !date;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setdate(event.target.value);
  };

  const handleSubmit = () => {
    if (date) {
      onSubmit(date);
      setdate('');
      handleOpen();
    }
  };
  return (
    <Dialog size="md" open={open} handler={handleOpen}>
      <DialogHeader>Selectionner une date</DialogHeader>
      <DialogBody className="flex flex-col gap-4">
        <Input
          type="date"
          label="Date"
          name="date"
          value={date}
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
          onClick={handleSubmit}
          disabled={disableAjout()}
        >
          <span>Confirmer</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RapportSelectDateDialog;
