/* eslint-disable @typescript-eslint/no-explicit-any */
export type IRole = 'admin' | 'cantine' | 'user' | 'extra';

export type IShowToast = (
  severity: 'success' | 'info' | 'warn' | 'error' | undefined,
  summary: string,
  detail: string,
) => void;

export interface IAuthContextUser {
  matricule: string;
  role: IRole;
  accessToken: string;
}

export interface IAuthContext {
  user: IAuthContextUser;
  setUser: (user: IAuthContextUser | null) => void;
}

export interface ILoginData {
  matricule_utilisateur: string;
  mot_de_passe: string;
}

//***********  Utilisateur  ********* */
export interface IUtilisateur {
  matricule_utilisateur: string;
  nom_utilisateur: string;
  prenom_utilisateur: string;
  email_utilisateur: string;
  tel_utilisateur: string;
  mot_de_passe?: string;
  poste_utilisateur: string;
  profil_utilisateur?: any;
  role_utilisateur: IRole;
}
export interface IUtilisateurFormData {
  matricule_utilisateur: string;
  nom_utilisateur: string;
  prenom_utilisateur: string;
  email_utilisateur: string;
  tel_utilisateur: string;
  mot_de_passe?: string;
  poste_utilisateur: string;
  file?: any;
  role_utilisateur: IRole;
  [key: string]: any;
}

//***********  Preference  ********* */
export interface IPreference {
  matricule_utilisateur: string;
  preferences: IIngredient[];
  restrictions: IIngredient[];
}

//***********  Indisponibilite  ********* */
export interface IIndisponibilite {
  id_indisponibilite: string;
  date_ind: string;
  matricule_utilisateur?: string | null;
}
export interface IIndisponibilitesFormData {
  date_ind: string[];
  matricule_utilisateur: string;
}

//***********  Cantine  ********* */
export interface ICantine {
  id_cantine: string;
  nom_cantine: string;
  debut_contrat: string | Date;
  fin_contrat: string | Date;
  type_contrat: string;
  nombre_repas: number;
  actif: boolean;
  matricule_utilisateur: string;
}
export interface ICantineOption {
  id_cantine: string;
  nom_cantine: string;
}
export interface ICantineOverviewTableData extends ICantine {
  nombre_commande_livree: number;
}
export interface ICantinesFormData {
  nom_cantine: string;
  debut_contrat: string;
  fin_contrat: string;
  type_contrat: string;
  nombre_repas: number;
  actif: boolean;
  matricule_utilisateur: string;
}

//***********  Categorie  ********* */
export interface ICategorie {
  id_categorie: number;
  nom_categorie: string;
  limite_categorie: number;
}
export interface ICategoriesFormData {
  nom_categorie: string;
  limite_categorie: number;
}

//***********  Ingredient  ********* */
export interface IIngredient {
  id_ingredient: string;
  nom_ingredient: string;
}
export interface IIngredientsFormData {
  nom_ingredient: string;
}

//***********  Plat  ********* */
export interface IPlat {
  id_plat: string;
  nom_plat: string;
  description_plat?: string;
  visuel_plat?: any;
  id_categorie: number;
  id_cantine: string;
  isAdorer?: boolean;
  cantine: ICantine;
  categorie: ICategorie;
  ingredients?: IIngredient[];
}
export interface IPlatMenu extends IPlat {
  present: {
    code_menu: string;
  };
}
export interface IPlatFormData {
  id_plat: string;
  nom_plat: string;
  description_plat?: string;
  file?: any | null;
  id_categorie: string | number;
  id_cantine: string;
  ingredients?: IIngredient[];
  [key: string]: any;
}

//***********  Menu  ********* */
export interface IMenu {
  id_menu: string;
  date_menu: string;
  date_limite: string;
  id_cantine: string;
  cantine: ICantine;
  plats: IPlatMenu[];
}
export interface IMenuModified {
  id_menu: string;
  date_menu: string | Date;
  date_limite: string;
  id_cantine: string;
  cantine: ICantine;
  plats: IPlatMenu[];
}
export interface IMenuDataForWeek extends IMenu {
  jour_de_la_semaine: number;
  isSelected: boolean;
  commande_possible: boolean;
  commandes?: ICommande[];
}
export interface IMenuFormData {
  id_menu: string;
  date_menu: string;
  date_limite: string;
  id_cantine: string;
  plats: { id_plat: string; code_menu: string }[];
}

//***********  Commande  ********* */
export interface ICommande {
  id_commande: string;
  etat_commande:
    | 'commandée'
    | 'en attente'
    | 'livrée'
    | 'annulée'
    | 'non prise';
  code_commande: string;
  date_commande: string | Date;
  utilisateur: IUtilisateur;
  menu: IMenuModified;
  id_menu: string;
  matricule_utilisateur: string;
}

export interface ICommandeFormData {
  id_commande?: string;
  etat_commande?:
    | 'commandée'
    | 'en attente'
    | 'livrée'
    | 'annulée'
    | 'non prise';
  code_commande?: string;
  id_menu?: string;
  date_menu?: string | Date;
}

//***********  Notification  ********* */
export interface INotification {
  id_notification: string;
  contenu_notification: string;
  lien_notification: string;
  type_notification: string;
  destinataire_notification: 'global' | 'personnel';
  date_notification: string | Date;
}
export interface INotificationsFormData {
  contenu_notification: string;
  lien_notification: string;
  date_lien?: string;
  type_notification: string;
  destinataire_notification: 'global' | 'personnel';
  utilisateurs?: string[];
}
