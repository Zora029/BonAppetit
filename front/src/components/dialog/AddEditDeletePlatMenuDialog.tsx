import { useState, useEffect } from 'react';

import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
} from '@material-tailwind/react';

import { IPlat, IPlatMenu } from '@/types';
import { emptyPlat } from '@/database';

interface IAddEditDeletePlatMenuDialogProps {
  open: boolean;
  handleOpen: () => void;
  onAdd: (plat: IPlatMenu) => void;
  onEdit: (plat: IPlatMenu, id: string) => void;
  onDelete: (id: string) => void;
  platOptions: IPlat[];
  plat?: IPlatMenu;
}

const AddEditDeletePlatMenuDialog: React.FC<
  IAddEditDeletePlatMenuDialogProps
> = ({ open, handleOpen, onAdd, onEdit, onDelete, platOptions, plat }) => {
  const emptyFormData: IPlatMenu = {
    ...emptyPlat,
    present: {
      code_menu: '',
    },
  };

  const [formData, setformData] = useState<IPlatMenu>(
    plat ? plat : emptyFormData,
  );

  useEffect(() => {
    setformData(plat ? plat : emptyFormData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plat]);

  const disableAjout = (): boolean => {
    return !(formData.present.code_menu && formData.id_plat);
  };

  const showAdd = (): boolean => {
    return !plat;
  };

  const showEdit = (): boolean => {
    return !!plat;
  };

  const showDelete = (): boolean => {
    return !!plat;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name == 'code') {
      setformData({ ...formData, present: { code_menu: value } });
    } else {
      setformData({ ...formData, [name]: value ? value : null });
    }
  };

  const handleSelectPlat = (event: DropdownChangeEvent) => {
    const plat = platOptions.find((plat) => plat.id_plat == event.value);
    if (plat) {
      setformData({
        ...formData,
        ...plat,
      });
    }
  };

  const handleAdd = () => {
    onAdd(formData);
    setformData(emptyFormData);
  };

  const handleEdit = () => {
    if (plat) {
      onEdit(formData, plat.id_plat);
    }
    setformData(emptyFormData);
  };

  const handleDelete = () => {
    if (plat) {
      onDelete(plat.id_plat);
    }
    setformData(emptyFormData);
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };

  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout plat</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Dropdown
          value={formData.id_plat}
          onChange={handleSelectPlat}
          options={platOptions}
          optionLabel="nom_plat"
          optionValue="id_plat"
          filter
          placeholder="Selectionner un plat & complémemt"
          className="border border-body"
          panelClassName="!z-[10000]"
        />
        <Input
          variant="outlined"
          label="Code"
          name="code"
          value={formData.present.code_menu}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
      </DialogBody>
      <DialogFooter>
        {showDelete() && (
          <Button
            className="mr-auto"
            variant="gradient"
            color="red"
            onClick={handleDelete}
          >
            <span>Supprimer</span>
          </Button>
        )}
        <Button
          variant="text"
          color="blue-gray"
          onClick={handleAnnuler}
          className="mr-1"
        >
          <span>Annuler</span>
        </Button>
        {showAdd() && (
          <Button
            variant="gradient"
            color="green"
            onClick={handleAdd}
            disabled={disableAjout()}
          >
            <span>Ajouter</span>
          </Button>
        )}
        {showEdit() && (
          <Button variant="gradient" color="blue" onClick={handleEdit}>
            <span>Modifier</span>
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default AddEditDeletePlatMenuDialog;
