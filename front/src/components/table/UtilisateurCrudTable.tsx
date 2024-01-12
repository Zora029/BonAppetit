/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FilterMatchMode, FilterOperator } from 'primereact/api';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowEditCompleteEvent,
} from 'primereact/datatable';
import {
  Column,
  ColumnEditorOptions,
  ColumnFilterElementTemplateOptions,
} from 'primereact/column';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Button, Input, Typography } from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { FunnelIcon } from '@heroicons/react/24/outline';

import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';
import AjoutUtilisateurDialog from '../dialog/AjoutUtilisateurDialog';

import { IUtilisateur, IUtilisateurFormData } from '@/types';
import { roleOptions } from '@/database';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import UtilisateurService from '@/services/utilisateur.service';

interface IUtilisateurCrudTableProps {
  updateListeUtilisateurs?: (users: IUtilisateur[]) => void;
}

const UtilisateurCrudTable: React.FC<IUtilisateurCrudTableProps> = ({
  updateListeUtilisateurs,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    matricule_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    poste_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    nom_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    prenom_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    email_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    tel_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    role_utilisateur: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };

  const [utilisateurs, setutilisateurs] = useState<IUtilisateur[]>([]);
  const [selectedUtilisateurs, setselectedUtilisateurs] = useState<
    IUtilisateur[]
  >([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  const disableSupprimer = (): boolean => {
    return selectedUtilisateurs.length < 1;
  };

  const getSeverity = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';

      case 'user':
        return 'info';

      case 'extra':
        return 'warning';

      case 'cantine':
        return 'success';

      default:
        return null;
    }
  };

  // Mounted
  useEffect(() => {
    retrieveUtilisateurs();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveUtilisateurs = async () => {
    try {
      const res = await UtilisateurService.getAll();
      setutilisateurs(res.data);
      if (updateListeUtilisateurs) {
        updateListeUtilisateurs(res.data);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue('');
  };

  // Handler
  const handleAddUtilisateur = async (user: IUtilisateurFormData) => {
    try {
      const formData = new FormData();

      for (const key in user) {
        formData.append(key, user[key]);
      }
      const res = await UtilisateurService.createOne(formData);

      setisAjoutDialogOpen(false);
      retrieveUtilisateurs();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { data, newData } = e;
    const newUtilisateur: IUtilisateurFormData = {
      matricule_utilisateur: newData.matricule_utilisateur,
      nom_utilisateur: newData.nom_utilisateur,
      prenom_utilisateur: newData.prenom_utilisateur,
      email_utilisateur: newData.email_utilisateur,
      tel_utilisateur: newData.tel_utilisateur,
      poste_utilisateur: newData.poste_utilisateur,
      role_utilisateur: newData.role_utilisateur,
    };

    try {
      const res = await UtilisateurService.updateOne(
        data.matricule_utilisateur,
        newUtilisateur,
      );
      retrieveUtilisateurs();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedCommandes = async () => {
    const selectedMatricules = selectedUtilisateurs.map(
      (val) => val.matricule_utilisateur,
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await UtilisateurService.deleteMany(selectedMatricules);
      retrieveUtilisateurs();
      setselectedUtilisateurs([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const etatsBodyTemplate = (rowData: IUtilisateur) => {
    return (
      <Tag
        value={rowData.role_utilisateur}
        severity={getSeverity(rowData.role_utilisateur)}
      />
    );
  };

  const etatsFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={roleOptions}
        onChange={(e: DropdownChangeEvent) =>
          options.filterCallback(e.value, options.index)
        }
        itemTemplate={etatsItemTemplate}
        placeholder="Selectionner"
        className="p-column-filter"
        showClear
      />
    );
  };

  const etatsItemTemplate = (option: string) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };

  const textEditor = (options: ColumnEditorOptions) => {
    return (
      options && (
        <InputText
          type="text"
          value={options.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            options.editorCallback?.(e.target.value)
          }
          className="max-w-[7rem] shadow-soft-sm"
        />
      )
    );
  };

  const etatEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={roleOptions}
        onChange={(e: DropdownChangeEvent) => options.editorCallback?.(e.value)}
        placeholder="Role..."
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <Button
        variant="outlined"
        onClick={clearFilter}
        className="flex items-center gap-3 border-body text-body"
      >
        <FunnelIcon className="h-5 w-5" />
        Réinitialiser les filtres
      </Button>
      <div className="w-60">
        <Input
          label="Rechercher"
          icon={<MagnifyingGlassIcon className="h-5 w-5" />}
          crossOrigin={undefined}
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
        />
      </div>
    </div>
  );

  return (
    <div className="h-full w-full rounded-2xl bg-white py-4 shadow-soft-xl">
      <div className="flex w-full items-center justify-between px-4 py-2">
        <Typography variant="h5">Liste Utilisateurs</Typography>
        <div className="mb-4 flex gap-4">
          <Button
            className="flex items-center gap-3"
            color="red"
            size="sm"
            onClick={() => setisSupprimerDialogOpen(true)}
            disabled={disableSupprimer()}
          >
            <MinusCircleIcon strokeWidth={2} className="h-4 w-4" /> Supprimer
          </Button>
          <Button
            className="flex items-center gap-3"
            color="green"
            size="sm"
            onClick={() => setisAjoutDialogOpen(true)}
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Ajout
          </Button>
        </div>
      </div>
      <DataTable
        value={utilisateurs}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
        dataKey="matricule_utilisateur"
        selectionMode="multiple"
        selection={selectedUtilisateurs}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setselectedUtilisateurs(e.value);
          }
        }}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          'matricule_utilisateur',
          'nom_utilisateur',
          'prenom_utilisateur',
          // 'email_utilisateur',
          // 'tel_utilisateur',
          'poste_utilisateur',
          'role_utilisateur',
        ]}
        emptyMessage="Aucun utilisateur trouvé."
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        currentPageReportTemplate="Affichage du {first} au {last} des {totalRecords} entrées"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
        ></Column>
        <Column
          field="matricule_utilisateur"
          header="Matricule"
          sortable
          filterField="matricule_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="poste_utilisateur"
          header="Poste"
          sortable
          filterField="poste_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="nom_utilisateur"
          header="Nom"
          sortable
          filterField="nom_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="prenom_utilisateur"
          header="Prenom"
          sortable
          filterField="prenom_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        {/* <Column
          field="email_utilisateur"
          header="Email"
          sortable
          filterField="email_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="tel_utilisateur"
          header="Tel"
          sortable
          filterField="tel_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        /> */}
        <Column
          field="role_utilisateur"
          header="Role"
          sortable
          filterMenuStyle={{ width: '10rem' }}
          style={{ minWidth: '12rem' }}
          body={etatsBodyTemplate}
          filter
          editor={(options) => etatEditor(options)}
          filterElement={etatsFilterTemplate}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
      </DataTable>
      <AjoutUtilisateurDialog
        open={isAjoutDialogOpen}
        handleOpen={() => setisAjoutDialogOpen((state) => !state)}
        onSubmit={handleAddUtilisateur}
      />
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen((state) => !state)}
        onConfirm={onDeleteSelectedCommandes}
      />
    </div>
  );
};

export default UtilisateurCrudTable;
