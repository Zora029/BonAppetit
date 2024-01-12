import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input, Card, Button, Badge, Alert } from '@material-tailwind/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import AddCard from '@/components/card/AddCard';
import PlatCardMenu from '@/components/card/PlatCardMenu';
import AddEditDeletePlatMenuDialog from '@/components/dialog/AddEditDeletePlatMenuDialog';

import {
  ICategorie,
  IMenuDataForWeek,
  IMenuFormData,
  IPlat,
  IPlatMenu,
} from '@/types';
import { emptyMenuDataForWeek } from '@/database';
import { errorHandler, getDateNow, successHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import MenuService from '@/services/menu.service';
import PlatService from '@/services/plat.service';
import CategorieService from '@/services/categorie.service';
import CommandeService from '@/services/commande.service';
import ConfirmDeleteDialog from '@/components/dialog/ConfirmDeleteDialog';

const AdminMenus = () => {
  const date_vise = getDateNow();

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Static Data
  const jours = [
    {
      nom: 'Lundi',
      valeur: 1,
    },
    {
      nom: 'Mardi',
      valeur: 2,
    },
    {
      nom: 'Mercredi',
      valeur: 3,
    },
    {
      nom: 'Jeudi',
      valeur: 4,
    },
    {
      nom: 'Vendredi',
      valeur: 5,
    },
  ];

  // Dynamic Data
  const [weekMenuData, setweekMenuData] = useState<IMenuDataForWeek[]>([]);
  const [menuSelectionner, setmenuSelectionner] =
    useState<IMenuDataForWeek>(emptyMenuDataForWeek);
  const [selectedCategorie, setselectedCategorie] = useState<number>(0);
  const [selectedPlat, setselectedPlat] = useState<IPlatMenu>();
  const [platsOptions, setplatsOptions] = useState<IPlat[]>([]);
  const [categorieOptions, setcategorieOptions] = useState<ICategorie[]>([]);
  const [isPlatModalOpen, setisPlatModalOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  // Mounted
  useEffect(() => {
    retrieveWeekMenu(date_vise);
    retrieveDatas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {}, [menuSelectionner]); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveWeekMenu = async (date: string) => {
    try {
      const res = await MenuService.getWeekMenuForAdmin(date);
      setweekMenuData(res.data);

      setmenuSelectionner(
        res.data.find((menu: IMenuDataForWeek) => menu.isSelected) ||
          res.data.find(
            (menu: IMenuDataForWeek) => menu.jour_de_la_semaine == 1,
          ) ||
          res.data[0],
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      PlatService.getAllPlatMenuOptions().then((res) => {
        setplatsOptions(res.data);
      });
      CategorieService.getAll().then((res) => {
        setcategorieOptions(res.data);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Functions
  const isAllowToCreateMenu = (day: number): boolean => {
    const result = weekMenuData.find((menu) => menu.jour_de_la_semaine == day)
      ?.commande_possible;
    return !!result;
  };

  const isMenuExist = (day: number): boolean => {
    const result = weekMenuData.find((menu) => menu.jour_de_la_semaine == day)
      ?.id_menu;
    return !!result;
  };

  const disableAction = (): boolean => {
    return !(
      menuSelectionner.date_menu &&
      menuSelectionner.date_limite &&
      menuSelectionner.cantine.id_cantine &&
      Array.isArray(menuSelectionner.plats) &&
      menuSelectionner.plats.length
    );
  };

  const showAdd = (): boolean => {
    return !menuSelectionner.id_menu;
  };
  const showEdit = (): boolean => {
    return !!menuSelectionner.id_menu;
  };
  const showDelete = (): boolean => {
    return !!menuSelectionner.id_menu;
  };

  // Handler
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    retrieveWeekMenu(event.target.value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setmenuSelectionner({ ...menuSelectionner, [name]: value });
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const dayNumber = parseInt(value);
    setmenuSelectionner(
      weekMenuData.find((menu) => menu.jour_de_la_semaine == dayNumber) ||
        weekMenuData[0],
    );
  };

  const handleShowPlatMenuModal = (id_categorie: number, plat?: IPlatMenu) => {
    setselectedCategorie(id_categorie);
    setselectedPlat(plat);
    setisPlatModalOpen(true);
  };

  const handleClosePlatMenuModal = () => {
    setselectedCategorie(0);
    setselectedPlat(undefined);
    setisPlatModalOpen(false);
  };

  const handleAddPlatMenu = (plat: IPlatMenu) => {
    setisPlatModalOpen(false);
    const _plats = [...menuSelectionner.plats];
    _plats.push(plat);
    setmenuSelectionner({ ...menuSelectionner, plats: _plats });
  };

  const handleEditPlatMenu = (plat: IPlatMenu, id: string) => {
    setisPlatModalOpen(false);
    showToast('success', 'Succès', 'Plat modifié');

    const _plats = [...menuSelectionner.plats];
    const index = _plats.findIndex((p) => p.id_plat === id);
    _plats[index] = plat;
    setmenuSelectionner({ ...menuSelectionner, plats: _plats });
  };

  const handleDeletePlatMenu = (id: string) => {
    setisPlatModalOpen(false);
    showToast('success', 'Succès', 'Plat supprimé');

    const _plats = [...menuSelectionner.plats].filter((p) => p.id_plat != id);
    setmenuSelectionner({ ...menuSelectionner, plats: _plats });
  };

  const handleAddMenu = async () => {
    try {
      if (!disableAction()) {
        const formData: IMenuFormData = {
          id_menu: menuSelectionner.id_menu,
          date_menu: menuSelectionner.date_menu,
          date_limite: menuSelectionner.date_limite,
          id_cantine: menuSelectionner.cantine.id_cantine,
          plats: menuSelectionner.plats.map((p) => ({
            id_plat: p.id_plat,
            code_menu: p.present.code_menu,
          })),
        };
        const res = await MenuService.createOne(formData);
        successHandler(res, showToast);
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleEditMenu = async () => {
    try {
      if (!disableAction() && menuSelectionner.id_menu) {
        const formData: IMenuFormData = {
          id_menu: menuSelectionner.id_menu,
          date_menu: menuSelectionner.date_menu,
          date_limite: menuSelectionner.date_limite,
          id_cantine: menuSelectionner.cantine.id_cantine,
          plats: menuSelectionner.plats.map((p) => ({
            id_plat: p.id_plat,
            code_menu: p.present.code_menu,
          })),
        };
        const res = await MenuService.updateOne(
          menuSelectionner.id_menu,
          formData,
        );
        successHandler(res, showToast);
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleDeleteMenu = async () => {
    try {
      if (menuSelectionner.id_menu) {
        const res = await MenuService.deleteOne(menuSelectionner.id_menu);
        setisSupprimerDialogOpen(false);
        successHandler(res, showToast);
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleGenerateDefaultChoices = async () => {
    try {
      const res = await CommandeService.generateDefaultChoicesForMenu(
        menuSelectionner.id_menu,
      );
      successHandler(res, showToast);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  return (
    <Card className="w-full" color="transparent" shadow={false}>
      <form className="flex min-h-[640px] flex-col gap-6 overflow-auto">
        {/* Choix de la date */}
        <div className="flex max-w-lg flex-row justify-start gap-4 pt-1">
          <Input
            type="date"
            name="date_menu"
            label="Selectionnez une date..."
            value={menuSelectionner.date_menu}
            onChange={handleDateChange}
            crossOrigin={undefined}
          />
          <Input
            type="text"
            label="Cantine active du jour"
            value={menuSelectionner.cantine.nom_cantine}
            disabled
            crossOrigin={undefined}
          />
          <Input
            type="datetime-local"
            name="date_limite"
            label="Date limite"
            value={menuSelectionner.date_limite.toString().substring(0, 16)}
            onChange={handleInputChange}
            crossOrigin={undefined}
          />
        </div>

        {/* Choix du jour de la semaine */}
        <ul className="flex list-none flex-row gap-6 text-xl font-semibold text-bodylight">
          {jours.map(({ nom, valeur }, index) => {
            return (
              <li key={index}>
                <input
                  type="radio"
                  id={nom}
                  name="jour_de_la_semaine"
                  value={valeur}
                  className="hidden"
                  onChange={handleDayChange}
                />
                <Badge
                  color={isAllowToCreateMenu(valeur) ? 'green' : 'red'}
                  invisible={isMenuExist(valeur)}
                >
                  <label
                    htmlFor={nom}
                    className={`cursor-pointer p-1 hover:text-selected ${
                      isMenuExist(valeur) ? 'text-primary' : ''
                    } ${
                      valeur == menuSelectionner.jour_de_la_semaine
                        ? 'text-selected'
                        : ''
                    }`}
                  >
                    {nom}
                  </label>
                </Badge>
              </li>
            );
          })}
        </ul>

        {/* Liste des choix */}
        <div className="flex min-h-[20rem] flex-col gap-4">
          {categorieOptions.map((c, index) => (
            <ul key={index} className="flex list-none flex-row flex-wrap gap-4">
              {menuSelectionner.plats
                .filter((plat) => plat.id_categorie == c.id_categorie)
                .sort((a, b) =>
                  a.present.code_menu > b.present.code_menu ? 1 : -1,
                )
                .map((plat, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      handleShowPlatMenuModal(c.id_categorie, plat)
                    }
                    className="cursor-pointer"
                  >
                    <PlatCardMenu platData={plat} />
                  </li>
                ))}
              <li>
                <AddCard
                  label={c.nom_categorie}
                  onClickAdd={() => handleShowPlatMenuModal(c.id_categorie)}
                />
              </li>
            </ul>
          ))}
        </div>

        {/* Boutton de confirmation des choix */}
        {!menuSelectionner.commande_possible && (
          <Alert
            icon={<ExclamationTriangleIcon className="h-6 w-6" />}
            className="max-w-md rounded-none border-l-4 border-danger bg-danger/10 font-medium text-danger"
          >
            Jour férié.
          </Alert>
        )}

        <div className="flex flex-row gap-5">
          {showAdd() && (
            <Button
              variant="gradient"
              color="green"
              onClick={handleAddMenu}
              disabled={disableAction()}
              className="max-w-[15rem] rounded-full"
            >
              <span>Ajouter</span>
            </Button>
          )}
          {showEdit() && (
            <Button
              variant="gradient"
              onClick={handleGenerateDefaultChoices}
              className="rounded-full"
            >
              <span>Générer les choix par défaut</span>
            </Button>
          )}
          {showEdit() && (
            <Button
              variant="gradient"
              color="blue"
              onClick={handleEditMenu}
              disabled={disableAction()}
              className="max-w-[15rem] rounded-full"
            >
              <span>Modifier</span>
            </Button>
          )}
          {showDelete() && (
            <Button
              variant="gradient"
              color="red"
              onClick={() => setisSupprimerDialogOpen(true)}
              className="max-w-[15rem] rounded-full"
            >
              <span>Supprimer</span>
            </Button>
          )}
        </div>
      </form>
      <AddEditDeletePlatMenuDialog
        open={isPlatModalOpen}
        handleOpen={handleClosePlatMenuModal}
        onAdd={handleAddPlatMenu}
        onEdit={handleEditPlatMenu}
        onDelete={handleDeletePlatMenu}
        platOptions={platsOptions.filter(
          (p) => p.id_categorie == selectedCategorie,
        )}
        plat={selectedPlat}
      />
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
        onConfirm={handleDeleteMenu}
      />
    </Card>
  );
};

export default AdminMenus;
