import { useState, useEffect } from 'react';

import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import {
  Button,
  Dialog,
  Input,
  DialogHeader,
  DialogFooter,
  DialogBody,
  Select,
  Option,
} from '@material-tailwind/react';

import ConfirmDeleteDialog from './ConfirmDeleteDialog';

import {
  ICantine,
  ICategorie,
  IIngredient,
  IPlat,
  IPlatFormData,
} from '@/types';

interface IAddEditDeletePlatDialogProps {
  open: boolean;
  handleOpen: () => void;
  ingredientsOptions: IIngredient[];
  cantinesOptions: ICantine[];
  categoriesOptions: ICategorie[];
  onAdd: (plat: IPlatFormData) => void;
  onEdit: (plat: IPlatFormData, id: string) => void;
  onDelete: (id: string) => void;
  plat: IPlat | null;
}

const AddEditDeletePlatDialog: React.FC<IAddEditDeletePlatDialogProps> = ({
  open,
  ingredientsOptions,
  cantinesOptions,
  categoriesOptions,
  handleOpen,
  onAdd,
  onEdit,
  onDelete,
  plat,
}) => {
  const emptyFormData: IPlatFormData = {
    id_plat: '',
    nom_plat: '',
    description_plat: undefined,
    file: undefined,
    id_cantine: '',
    id_categorie: '',
    ingredients: [],
  };

  const [formData, setformData] = useState<IPlatFormData>(
    plat
      ? {
          id_plat: plat.id_plat,
          nom_plat: plat.nom_plat,
          description_plat: plat.description_plat,
          file: undefined,
          id_cantine: plat.id_cantine,
          id_categorie: plat.id_categorie,
          ingredients: plat.ingredients,
        }
      : emptyFormData,
  );
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  const disableAjout = (): boolean => {
    return !(formData.nom_plat && formData.id_cantine && formData.id_categorie);
  };

  const showAdd = (): boolean => {
    return !formData.id_plat;
  };

  const showEdit = (): boolean => {
    return !!formData.id_plat;
  };

  const showDelete = (): boolean => {
    return !!formData.id_plat;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    if (name == 'file') {
      setformData({ ...formData, file: files ? files[0] : null });
    } else {
      setformData({ ...formData, [name]: value ? value : null });
    }
  };

  const handleSelectCantine = (value: string) => {
    setformData({
      ...formData,
      id_cantine: value,
    });
  };

  const handleSelectCategorie = (value: string) => {
    setformData({
      ...formData,
      id_categorie: parseInt(value),
    });
  };

  const handleSelectIngredients = (e: MultiSelectChangeEvent) => {
    setformData({ ...formData, ingredients: e.value });
  };

  const handleAdd = () => {
    onAdd(formData);
    setformData(emptyFormData);
  };

  const handleEdit = () => {
    onEdit(formData, formData.id_plat);
    setformData(emptyFormData);
  };

  const handleDelete = () => {
    setisSupprimerDialogOpen(false);
    onDelete(formData.id_plat);
    setformData(emptyFormData);
  };

  const handleAnnuler = () => {
    setformData(emptyFormData);
    handleOpen();
  };

  useEffect(() => {
    setformData(
      plat
        ? {
            id_plat: plat.id_plat,
            nom_plat: plat.nom_plat,
            description_plat: plat.description_plat,
            file: undefined,
            id_cantine: plat.id_cantine,
            id_categorie: plat.id_categorie,
            ingredients: plat.ingredients,
          }
        : emptyFormData,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plat]);

  return (
    <Dialog size="xs" open={open} handler={handleOpen}>
      <DialogHeader>Ajout plat</DialogHeader>
      <DialogBody className="flex flex-col gap-6">
        <Input
          variant="outlined"
          label="Nom"
          name="nom_plat"
          value={formData.nom_plat}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Input
          variant="outlined"
          label="Description"
          name="description_plat"
          value={formData.description_plat || ''}
          onChange={handleInputChange}
          crossOrigin={undefined}
        />
        <Select
          name="id_cantine"
          value={formData.id_cantine}
          onChange={(val) => val && handleSelectCantine(val)}
          variant="outlined"
          label="Cantine"
        >
          {cantinesOptions.map((cantine, index) => (
            <Option key={index} value={cantine.id_cantine}>
              {cantine.nom_cantine}
            </Option>
          ))}
        </Select>
        <Select
          name="id_categorie"
          value={formData.id_categorie + ''}
          onChange={(val) => val && handleSelectCategorie(val)}
          variant="outlined"
          label="Catégorie"
        >
          {categoriesOptions.map((cantine, index) => (
            <Option key={index} value={cantine.id_categorie + ''}>
              {cantine.nom_categorie}
            </Option>
          ))}
        </Select>
        <MultiSelect
          value={formData.ingredients}
          onChange={handleSelectIngredients}
          options={ingredientsOptions}
          optionLabel="nom_ingredient"
          display="chip"
          filter
          placeholder="Sélectionnez les ingredients..."
          className="rounded border border-solid border-blue-gray-300"
          panelClassName="!z-[10000]"
        />
        <input type="file" name="file" onChange={handleInputChange} />
      </DialogBody>
      <DialogFooter>
        {showDelete() && (
          <Button
            className="mr-auto"
            variant="gradient"
            color="red"
            onClick={() => setisSupprimerDialogOpen(open)}
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
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
        onConfirm={handleDelete}
      />
    </Dialog>
  );
};

export default AddEditDeletePlatDialog;
