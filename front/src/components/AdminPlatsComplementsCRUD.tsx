import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';

import { IconButton, Input, Option, Select } from '@material-tailwind/react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

import AdminPlatCard from '@/components/card/AdminPlatCard';
import AddEditDeletePlatDialog from './dialog/AddEditDeletePlatDialog';
import AddCard from './card/AddCard';

import {
  ICantine,
  ICategorie,
  IIngredient,
  IPlat,
  IPlatFormData,
} from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import PlatService from '@/services/plat.service';
import CantineService from '@/services/cantine.service';
import CategorieService from '@/services/categorie.service';
import IngredientService from '@/services/ingredient.service';

interface IPlatFilter {
  filtre: string;
  categorie: number;
  ingredient: string;
  cantine: string;
}

const AdminPlatsComplementsCRUD = () => {
  // Static data
  const defaultFilters: IPlatFilter = {
    filtre: '',
    categorie: 0,
    ingredient: '',
    cantine: '',
  };

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [plats, setplats] = useState<IPlat[]>([]);
  const [filteredPlats, setfilteredPlats] = useState<IPlat[]>([]);
  const [showedPlats, setshowedPlats] = useState<IPlat[]>([]);
  const [selectedPlat, setselectedPlat] = useState<IPlat | null>(null);
  const [cantineOptions, setcantineOptions] = useState<ICantine[]>([]);
  const [categorieOptions, setcategorieOptions] = useState<ICategorie[]>([]);
  const [ingredientOptions, setingredientOptions] = useState<IIngredient[]>([]);
  const [search, setsearch] = useState('');
  const [filters, setFilters] = useState<IPlatFilter>(defaultFilters);
  const [isAddEditDeletePlatDialogOpen, setisAddEditDeletePlatDialogOpen] =
    useState<boolean>(false);

  // Mounted
  useEffect(() => {
    retrievePlats();
    retrieveDatas();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const _plats = plats.filter((plat) => {
      const isCantineValided = filters.cantine
        ? plat.id_cantine === filters.cantine
        : true;
      const isCategorieValided = filters.categorie
        ? plat.id_categorie === filters.categorie
        : true;
      const isIngredientValided = filters.ingredient
        ? plat.ingredients?.some(
            (ing) => ing.id_ingredient === filters.ingredient,
          )
        : true;
      return isCantineValided && isCategorieValided && isIngredientValided;
    });
    setfilteredPlats(_plats);
  }, [filters, plats]);

  useEffect(() => {
    const _plats = filteredPlats.filter((plat) =>
      plat.nom_plat.toLowerCase().includes(search.toLowerCase()),
    );
    setshowedPlats(_plats);
  }, [filteredPlats, search]);

  const retrievePlats = async () => {
    try {
      const res = await PlatService.getAll();
      setplats(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      CantineService.getAll().then((res) => {
        setcantineOptions(res.data);
      });
      CategorieService.getAll().then((res) => {
        setcategorieOptions(res.data);
      });
      IngredientService.getAll().then((res) => {
        setingredientOptions(res.data);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Handler
  const handleShowCRUDDialog = (plat: IPlat | null) => {
    setselectedPlat(plat);

    setisAddEditDeletePlatDialogOpen(true);
  };

  const handleCloseCRUDDialog = () => {
    setselectedPlat(null);
    setisAddEditDeletePlatDialogOpen(false);
  };

  const handleAddPlat = async (plat: IPlatFormData) => {
    try {
      const formData = new FormData();

      for (const key in plat) {
        if (key != 'id_plat') {
          if (key == 'ingredients') {
            formData.append(key, JSON.stringify(plat[key]));
          } else {
            formData.append(key, plat[key]);
          }
        }
      }
      const res1 = await PlatService.createOne(formData);

      setisAddEditDeletePlatDialogOpen(false);

      const res2 = await PlatService.getOne(res1.data.id_plat);
      setplats([res2.data, ...plats]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleEditPlat = async (plat: IPlatFormData, id: string) => {
    try {
      const formData = new FormData();
      for (const key in plat) {
        if (key == 'ingredients') {
          formData.append(key, JSON.stringify(plat[key]));
        } else {
          formData.append(key, plat[key]);
        }
      }

      const res1 = await PlatService.updateOne(id, formData);

      setisAddEditDeletePlatDialogOpen(false);
      showToast('success', 'Succès', res1.data.message);

      const res2 = await PlatService.getOne(id);
      const _plats = [...plats];
      const index = _plats.findIndex((plat) => plat.id_plat === id);
      _plats[index] = res2.data;
      setplats(_plats);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleDeletePlat = async (id: string) => {
    try {
      const res = await PlatService.deleteOne(id);

      setisAddEditDeletePlatDialogOpen(false);
      showToast('success', 'Succès', res.data.message);

      const _plats = [...plats];
      const index = _plats.findIndex((plat) => plat.id_plat === id);
      _plats.splice(index, 1);
      setplats(_plats);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setsearch(event.target.value);
  };

  const handleCategorieChange = (value: string) => {
    setFilters({ ...filters, categorie: value != ' ' ? parseInt(value) : 0 });
  };

  const handleIngredientChange = (value: string) => {
    setFilters({ ...filters, ingredient: value != ' ' ? value : '' });
  };

  const handleCantineChange = (value: string) => {
    setFilters({ ...filters, cantine: value != ' ' ? value : '' });
  };

  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setsearch('');
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Filtre et recherche */}
      <div className="flex flex-row justify-between gap-6">
        <ul className="flex list-none flex-row gap-4">
          <IconButton
            variant="outlined"
            onClick={clearFilter}
            className="border-body p-4 text-body"
          >
            <FunnelIcon className="h-5 w-5" />
          </IconButton>
          <Select
            name="categorie"
            value={filters.categorie + ''}
            onChange={(val) => val && handleCategorieChange(val)}
            variant="standard"
            label="Catégorie"
          >
            <Option value=" ">Tout</Option>
            {categorieOptions.map(({ id_categorie, nom_categorie }, index) => (
              <Option key={index} value={id_categorie + ''}>
                {nom_categorie}
              </Option>
            ))}
          </Select>
          <Select
            name="ingredient"
            value={filters.ingredient}
            onChange={(val) => val && handleIngredientChange(val)}
            variant="standard"
            label="Ingrédient"
          >
            <Option value=" ">Tout</Option>
            {ingredientOptions.map(
              ({ id_ingredient, nom_ingredient }, index) => (
                <Option key={index} value={id_ingredient}>
                  {nom_ingredient}
                </Option>
              ),
            )}
          </Select>
          <Select
            name="cantine"
            value={filters.cantine}
            onChange={(val) => val && handleCantineChange(val)}
            variant="standard"
            label="Cantine"
          >
            <Option value=" ">Tout</Option>
            {cantineOptions.map(({ id_cantine, nom_cantine }, index) => (
              <Option key={index} value={id_cantine}>
                {nom_cantine}
              </Option>
            ))}
          </Select>
        </ul>
        <div className="relative flex w-full max-w-[24rem]">
          <Input
            type="text"
            label="Rechercher..."
            value={search}
            onChange={handleSearchChange}
            className="pr-10"
            containerProps={{
              className: 'min-w-0',
            }}
            crossOrigin={undefined}
          />
          <IconButton
            variant="text"
            color={search ? 'blue' : 'gray'}
            disabled={!search}
            className="!absolute right-0 top-0 rounded"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      {/* Liste des Plats */}
      <ul className="flex flex-shrink-0 list-none flex-row flex-wrap justify-center gap-4 2xl:grid 2xl:grid-cols-4">
        <li>
          <AddCard label="Plat" onClickAdd={() => handleShowCRUDDialog(null)} />
        </li>
        {showedPlats.map((plat, index) => (
          <li
            onClick={() => handleShowCRUDDialog(plat)}
            className="cursor-pointer"
            key={index}
          >
            <AdminPlatCard key={index} platData={plat} />
          </li>
        ))}
      </ul>
      {/* <Pagination /> */}

      {/* CRUD dialog */}
      <AddEditDeletePlatDialog
        open={isAddEditDeletePlatDialogOpen}
        handleOpen={handleCloseCRUDDialog}
        ingredientsOptions={ingredientOptions}
        cantinesOptions={cantineOptions}
        categoriesOptions={categorieOptions}
        onAdd={handleAddPlat}
        onEdit={handleEditPlat}
        onDelete={handleDeletePlat}
        plat={selectedPlat}
      />
    </div>
  );
};

export default AdminPlatsComplementsCRUD;
