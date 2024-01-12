import React from 'react';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Alert,
} from '@material-tailwind/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';

interface IConfirmDeleteDialogProps {
  open: boolean;
  handleOpen: () => void;
  onConfirm: () => void;
}
const ConfirmDeleteDialog: React.FC<IConfirmDeleteDialogProps> = ({
  open,
  handleOpen,
  onConfirm,
}) => {
  return (
    <Dialog open={open} size="xs" handler={handleOpen}>
      <DialogHeader>Confirmation de suppression</DialogHeader>
      <DialogBody>
        <Alert
          icon={<ExclamationTriangleIcon className="h-10 w-10 text-danger" />}
          className="rounded-none bg-transparent text-body"
        >
          Êtes-vous sûr(e) de vouloir supprimer les éléments sélectionnés ?
        </Alert>
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
        <Button variant="gradient" color="red" onClick={onConfirm}>
          <span>Confirmer</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
