import {
  IAuthContext,
  ICantine,
  ICategorie,
  ILoginData,
  IPlat,
  ICommandeFormData,
  IMenuDataForWeek,
  IRole,
} from '../types';

// ******************************** Static ************************************
export const extraTypeData: string[] = [
  'Gardien',
  'Police',
  'Visiteur',
  'Extra',
];

export const emptyCantine: ICantine = {
  id_cantine: '',
  nom_cantine: '',
  actif: true,
  debut_contrat: '',
  fin_contrat: '',
  matricule_utilisateur: '',
  nombre_repas: 0,
  type_contrat: '',
};

export const emptyCategorie: ICategorie = {
  id_categorie: 0,
  nom_categorie: '',
  limite_categorie: 1,
};

export const emptyPlat: IPlat = {
  id_plat: '',
  nom_plat: '',
  description_plat: '',
  id_cantine: '',
  id_categorie: 0,
  ingredients: [],
  cantine: emptyCantine,
  categorie: emptyCategorie,
};

export const emptyMenuDataForWeek: IMenuDataForWeek = {
  id_menu: '',
  date_menu: '',
  date_limite: '',
  jour_de_la_semaine: 1,
  isSelected: true,
  commande_possible: true,
  plats: [],
  id_cantine: '',
  cantine: emptyCantine,
};

export const emptyCommandeFormData: ICommandeFormData = {
  id_commande: '',
  etat_commande: 'commandée',
  code_commande: '',
  id_menu: '',
};

export const defaultAuthContext: IAuthContext = {
  user: {
    matricule: '',
    role: 'user',
    accessToken: '',
  },
  setUser: (user) => user,
};

export const defaultLoginValue: ILoginData = {
  matricule_utilisateur: '',
  mot_de_passe: '',
};

export const jours = [
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

export const etatsCommande = [
  'commandée',
  'en attente',
  'livrée',
  'annulée',
  'non prise',
];

export const roleOptions: IRole[] = ['admin', 'cantine', 'user', 'extra'];

export const extraMatricule: string[] = ['GRD', 'PLC', 'VST', 'EXT'];
