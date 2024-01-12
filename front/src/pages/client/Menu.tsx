import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Input,
  Card,
  Typography,
  Button,
  Badge,
  Alert,
} from '@material-tailwind/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Switcher from '@/components/inputs/Switcher';

import PlatCardMenuClient from '@/components/card/PlatCardMenuClient';

import {
  ICategorie,
  ICommandeFormData,
  IIngredient,
  IMenuDataForWeek,
  IPlatMenu,
} from '@/types';
import { useToast } from '@/contexts/ToastContext';
import { emptyMenuDataForWeek, jours } from '@/database';
import { errorHandler, getDateNow, isDateBefore } from '@/utils';
import MenuService from '@/services/menu.service';
import CategorieService from '@/services/categorie.service';
import UtilisateurService from '@/services/utilisateur.service';
import CommandeService from '@/services/commande.service';

const Menu = () => {
  const { date: date_vise } = useParams<{ date: string }>();

  const navigate = useNavigate();
  const { showToast } = useToast();

  // Dynamic Data
  const [weekMenuData, setweekMenuData] = useState<IMenuDataForWeek[]>([]);
  const [menuSelectionner, setmenuSelectionner] =
    useState<IMenuDataForWeek>(emptyMenuDataForWeek);
  const [platsSelectionnesParCategorie, setplatsSelectionnesParCategorie] =
    useState<{ [id_categorie: string]: IPlatMenu[] }>({});
  const [categorieOptions, setcategorieOptions] = useState<ICategorie[]>([]);
  const [isfiltred, setisfiltred] = useState(false);
  const [showedPlat, setshowedPlat] = useState<IPlatMenu[]>([]);
  const [restrictions, setrestrictions] = useState<string[]>([]);

  // Mounted
  useEffect(() => {
    retrieveWeekMenu(date_vise ? date_vise : '');
    retrieveDatas();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setplatsSelectionnesParCategorie({});
    if (menuSelectionner.plats.length > 0) {
      if (isfiltred) {
        const _showedPlats = menuSelectionner.plats.filter((plat) => {
          // Vérifie si aucun des ingrédients du plat n'est dans les restrictions
          if (plat.ingredients) {
            const platIngredients = plat.ingredients.map(
              (ingredient) => ingredient.id_ingredient,
            );
            return !platIngredients.some((ingredientId) =>
              restrictions.includes(ingredientId),
            );
          } else {
            return true;
          }
        });
        setshowedPlat(_showedPlats);
      } else {
        setshowedPlat(menuSelectionner.plats);
      }
    }
  }, [isfiltred, menuSelectionner, restrictions]);

  const retrieveWeekMenu = async (date: string) => {
    try {
      const res = await MenuService.getWeekMenuForClient(date);
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
      CategorieService.getAll().then((res) => {
        setcategorieOptions(res.data);
      });
      UtilisateurService.getPreferences().then((res) => {
        const _restrictions = res.data.restrictions.map(
          (i: IIngredient) => i.id_ingredient,
        );
        setrestrictions(_restrictions);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Functions
  const isCommandePossible = (day: number): boolean => {
    const result = weekMenuData.find((menu) => menu.jour_de_la_semaine == day)
      ?.commande_possible;
    return !!result;
  };

  const isCommandeExist = (day: number): boolean => {
    const result = weekMenuData.find((menu) => menu.jour_de_la_semaine == day)
      ?.commandes?.length;
    return !!result;
  };

  const showAdd = (): boolean => {
    return menuSelectionner.commandes
      ? menuSelectionner.commandes.length < 1
      : true;
  };
  const showEdit = (): boolean => {
    return menuSelectionner.commandes
      ? menuSelectionner.commandes.length > 0 &&
          (menuSelectionner.date_menu == getDateNow() ||
            isDateBefore(getDateNow(), menuSelectionner.date_menu))
      : false;
  };
  const showAnnuler = (): boolean => {
    if (
      menuSelectionner.commandes &&
      menuSelectionner.commandes[0] &&
      menuSelectionner.commandes[0].etat_commande == 'commandée' &&
      (menuSelectionner.date_menu == getDateNow() ||
        isDateBefore(getDateNow(), menuSelectionner.date_menu))
    ) {
      return true;
    } else {
      return false;
    }
  };
  const showReprendreLaCommande = (): boolean => {
    if (
      menuSelectionner.commandes &&
      menuSelectionner.commandes[0] &&
      menuSelectionner.commandes[0].etat_commande == 'non prise' &&
      (menuSelectionner.date_menu == getDateNow() ||
        isDateBefore(getDateNow(), menuSelectionner.date_menu))
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isConfirmationPossible = (): boolean => {
    if (!menuSelectionner.commande_possible) return false;
    for (const propriete in platsSelectionnesParCategorie) {
      if (platsSelectionnesParCategorie[propriete].length > 0) {
        return true;
      }
    }
    return false;
  };

  // Handler
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    retrieveWeekMenu(event.target.value);
  };

  const handleDayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const dayNumber = parseInt(value);
    setmenuSelectionner(
      weekMenuData.find((menu) => menu.jour_de_la_semaine == dayNumber) ||
        weekMenuData[0],
    );
  };

  function handleSelectionPlat(plat: IPlatMenu, id_categorie: number): void {
    const platsSelectionnes = platsSelectionnesParCategorie[id_categorie] || [];
    const index = platsSelectionnes.findIndex(
      (p) => p.id_plat === plat.id_plat,
    );
    const limiteDeChoixParCategorie =
      categorieOptions.find((c) => c.id_categorie === id_categorie)
        ?.limite_categorie || 1;

    if (index !== -1) {
      // Désélectionnez le plat s'il est déjà sélectionné
      const nouveauxPlatsSelectionnes = [...platsSelectionnes];
      nouveauxPlatsSelectionnes.splice(index, 1);

      setplatsSelectionnesParCategorie({
        ...platsSelectionnesParCategorie,
        [id_categorie]: nouveauxPlatsSelectionnes,
      });
    } else {
      // Vérifiez la limite de choix par catégorie
      if (platsSelectionnes.length < limiteDeChoixParCategorie) {
        const nouveauxPlatsSelectionnes = [...platsSelectionnes, plat];

        setplatsSelectionnesParCategorie({
          ...platsSelectionnesParCategorie,
          [id_categorie]: nouveauxPlatsSelectionnes,
        });
      } else {
        // Ajout du plat et suppression du premier élément
        const nouveauxPlatsSelectionnes = [...platsSelectionnes, plat];
        nouveauxPlatsSelectionnes.shift();

        setplatsSelectionnesParCategorie({
          ...platsSelectionnesParCategorie,
          [id_categorie]: nouveauxPlatsSelectionnes,
        });
      }
    }
  }

  const handleIsOrdered = (code: string): boolean => {
    if (menuSelectionner.commandes && menuSelectionner.commandes[0]) {
      return menuSelectionner.commandes[0].code_commande.includes(code);
    }
    return false;
  };

  const handleIsSelected = (id_plat: string, id_categorie: number): boolean => {
    if (platsSelectionnesParCategorie[id_categorie]) {
      return platsSelectionnesParCategorie[id_categorie].some(
        (p) => p.id_plat == id_plat,
      );
    } else {
      return false;
    }
  };

  const handleAddCommande = async () => {
    try {
      if (isConfirmationPossible()) {
        const listeCode: string[] = [];
        for (const key in platsSelectionnesParCategorie) {
          platsSelectionnesParCategorie[key].forEach((p) =>
            listeCode.push(p.present.code_menu),
          );
        }
        const formData: ICommandeFormData = {
          id_commande: '',
          id_menu: menuSelectionner.id_menu,
          date_menu: menuSelectionner.date_menu,
          etat_commande: 'commandée',
          code_commande: listeCode.join(''),
        };

        await CommandeService.createOne(formData);
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleEditCommande = async () => {
    try {
      if (
        isConfirmationPossible() &&
        menuSelectionner.commandes &&
        menuSelectionner.commandes[0] &&
        menuSelectionner.commandes[0].id_commande
      ) {
        const listeCode: string[] = [];
        for (const key in platsSelectionnesParCategorie) {
          platsSelectionnesParCategorie[key].forEach((p) =>
            listeCode.push(p.present.code_menu),
          );
        }
        const formData: ICommandeFormData = {
          code_commande: listeCode.join(''),
          etat_commande: 'commandée',
          id_menu: menuSelectionner.commandes[0].id_menu,
        };
        await CommandeService.updateOne(
          menuSelectionner.commandes[0].id_commande,
          formData,
        );
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleAnnulerCommande = async () => {
    try {
      if (
        menuSelectionner.commandes &&
        menuSelectionner.commandes[0] &&
        menuSelectionner.commandes[0].id_commande
      ) {
        await CommandeService.takingCommandeForClient(
          menuSelectionner.commandes[0].id_commande,
        );
        retrieveWeekMenu(menuSelectionner.date_menu);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleOnAdorer = async (id: string) => {
    try {
      await UtilisateurService.adorerPlat(id);

      const _plats = [...menuSelectionner.plats].map((p) => {
        if (p.id_plat == id) {
          return { ...p, isAdorer: !p.isAdorer };
        } else {
          return p;
        }
      });
      setmenuSelectionner({ ...menuSelectionner, plats: _plats });
    } catch (err) {
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
            type="datetime-local"
            name="date_limite"
            label="Date limite"
            disabled
            value={menuSelectionner.date_limite.toString().substring(0, 16)}
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
                  color={isCommandePossible(valeur) ? 'green' : 'red'}
                  invisible={isCommandeExist(valeur)}
                >
                  <label
                    htmlFor={nom}
                    className={`cursor-pointer p-1 hover:text-selected ${
                      isCommandeExist(valeur) ? 'text-primary' : ''
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

        {/* Activation des preferences */}
        <div className="flex flex-row gap-2">
          <Switcher
            id="restriction"
            enabled={isfiltred}
            setEnabled={() => setisfiltred(!isfiltred)}
          />
          <label htmlFor="restriction" className="cursor-pointer font-medium">
            Appliquer les restrictions alimentaires
          </label>
        </div>

        {/* Liste des choix */}
        {menuSelectionner.plats.length > 0 ? (
          <div className="flex min-h-[20rem] flex-col gap-4">
            {categorieOptions.map((c, index) => (
              <ul
                key={index}
                className="flex list-none flex-row flex-wrap gap-4"
              >
                {showedPlat
                  .filter((plat) => plat.id_categorie == c.id_categorie)
                  .map((plat, index) => (
                    <li key={index}>
                      <PlatCardMenuClient
                        platData={plat}
                        selection={() =>
                          handleSelectionPlat(plat, c.id_categorie)
                        }
                        isOrdered={handleIsOrdered(plat.present.code_menu)}
                        isSelected={handleIsSelected(
                          plat.id_plat,
                          plat.id_categorie,
                        )}
                        onAdorer={() => handleOnAdorer(plat.id_plat)}
                      />
                    </li>
                  ))}
              </ul>
            ))}
          </div>
        ) : (
          <Typography className="flex min-h-[20rem] max-w-md items-center justify-center pt-4 text-center font-medium">
            Le menu n'est pas encore disponible.
            <br />
            Veuillez revenir plus tard
          </Typography>
        )}

        {/* Boutton de confirmation des choix */}
        {!menuSelectionner.commande_possible &&
          menuSelectionner.plats.length > 0 &&
          isDateBefore(getDateNow(), menuSelectionner.date_menu) && (
            <Alert
              icon={<ExclamationTriangleIcon className="h-6 w-6" />}
              className="max-w-md rounded-none border-l-4 border-danger bg-danger/10 font-medium text-danger"
            >
              Vous ne pouvez pas faire de commande.
            </Alert>
          )}

        {menuSelectionner.commandes &&
          menuSelectionner.commandes[0] &&
          menuSelectionner.commandes[0].etat_commande == 'non prise' && (
            <Alert
              icon={<ExclamationTriangleIcon className="h-6 w-6" />}
              className="max-w-md rounded-none border-l-4 border-danger bg-danger/10 font-medium text-danger"
            >
              Vous avez décidé de ne pas prendre votre commande.
            </Alert>
          )}

        <div className="flex flex-row gap-5">
          {isConfirmationPossible() && showAdd() && (
            <Button
              variant="gradient"
              color="green"
              onClick={handleAddCommande}
              className="max-w-[15rem] rounded-full"
            >
              <span>Confirmer</span>
            </Button>
          )}
          {isConfirmationPossible() && showEdit() && (
            <Button
              variant="gradient"
              color="blue"
              onClick={handleEditCommande}
              className="max-w-[15rem] rounded-full"
            >
              <span>Modifier</span>
            </Button>
          )}
          {showAnnuler() && (
            <Button
              variant="gradient"
              color="red"
              onClick={handleAnnulerCommande}
              className="max-w-[15rem] rounded-full"
            >
              <span>Annuler</span>
            </Button>
          )}
          {showReprendreLaCommande() && (
            <Button
              variant="gradient"
              color="green"
              onClick={handleAnnulerCommande}
              className="max-w-[15rem] rounded-full"
            >
              <span>Reprendre la commande</span>
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};

export default Menu;
