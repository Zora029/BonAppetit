/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect, useRef } from 'react';
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
import { Calendar } from 'primereact/calendar';
import { Button, Input, Typography } from '@material-tailwind/react';
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { ArrowUpTrayIcon, FunnelIcon } from '@heroicons/react/24/outline';

import SelectDateDialog from '../dialog/SelectDateDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';
import AjoutCommandeDialog from '../dialog/AjoutCommandeDialog';

import { ICommande, ICommandeFormData } from '@/types';
import { etatsCommande } from '@/database';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import CommandeService from '@/services/commande.service';
import UtilisateurService from '@/services/utilisateur.service';

const CommandeCrudTable = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    'menu.date_menu': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    'utilisateur.matricule_utilisateur': {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    code_commande: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    etat_commande: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    date_commande: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
  };

  const dt = useRef<DataTable<ICommande[]>>(null);

  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [selectedCommandes, setSelectedCommandes] = useState<ICommande[]>([]);
  const [matriculeOptions, setmatriculeOptions] = useState<string[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);
  const [isCommandeeToNonPriseOpen, setisCommandeeToNonPriseOpen] =
    useState<boolean>(false);

  const disableSupprimer = (): boolean => {
    return selectedCommandes.length < 1;
  };

  const getSeverity = (etat: string) => {
    switch (etat) {
      case 'erreur':
        return 'danger';

      case 'commandée':
        return 'info';

      case 'en attente':
        return 'warning';

      case 'livrée':
        return 'success';

      case 'annulée':
        return 'danger';

      default:
        return null;
    }
  };

  // Mounted
  useEffect(() => {
    retrieveCommandes();
    retrieveDatas();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveCommandes = async () => {
    try {
      const res = await CommandeService.getAll();
      setCommandes(getCommandes(res.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      UtilisateurService.getAllIds().then((res) => {
        setmatriculeOptions(res.data);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const getCommandes = (data: ICommande[]) => {
    return [...(data || [])].map((d) => {
      d.menu.date_menu = new Date(d.menu.date_menu);
      d.date_commande = new Date(d.date_commande);

      return d;
    });
  };

  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue('');
  };

  const exportCSV = () => {
    dt.current?.exportCSV();
  };

  const formatDate = (value: string | Date) => {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handler
  const handleAddCommmande = async (
    com: ICommandeFormData,
    matricule: string,
  ) => {
    try {
      const res = await CommandeService.createOneForAdmin(com, matricule);
      setisAjoutDialogOpen(false);
      retrieveCommandes();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { data, newData } = e;
    const newCommande: ICommandeFormData = {
      code_commande: newData.code_commande,
      etat_commande: newData.etat_commande,
    };

    try {
      const res = await CommandeService.updateOneForAdmin(
        data.id_commande,
        newCommande,
      );
      retrieveCommandes();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedCommandes = async () => {
    const selectedCommandesIds = selectedCommandes.map(
      (val) => val.id_commande,
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await CommandeService.deleteMany(selectedCommandesIds);
      retrieveCommandes();
      setSelectedCommandes([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const handleUpdateAllCommandeComToNPFromDate = async (date: string) => {
    try {
      const res = await CommandeService.updateAllCommandeComToNPFromDate(date);
      retrieveCommandes();
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

  const dateMenuBodyTemplate = (rowData: ICommande) => {
    return formatDate(rowData.menu.date_menu);
  };

  const dateCommandeBodyTemplate = (rowData: ICommande) => {
    return formatDate(rowData.date_commande);
  };

  const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Calendar
        value={options.value}
        onChange={(e) =>
          e.value && options.filterApplyCallback(e.value, options.index)
        }
        dateFormat="dd/mm/yy"
        placeholder="dd/mm/yyyy"
        mask="99/99/9999"
      />
    );
  };

  const etatsBodyTemplate = (rowData: ICommande) => {
    return (
      <Tag
        value={rowData.etat_commande}
        severity={getSeverity(rowData.etat_commande)}
      />
    );
  };

  const etatsFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={etatsCommande}
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
        options={etatsCommande}
        onChange={(e: DropdownChangeEvent) => options.editorCallback?.(e.value)}
        placeholder="Etats"
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
        <Typography variant="h5">Liste Commandes</Typography>
        <div className="mb-4 flex gap-4">
          <Button
            className="flex items-center gap-3"
            size="sm"
            onClick={() => exportCSV()}
          >
            <ArrowUpTrayIcon strokeWidth={2} className="h-4 w-4" /> Export
          </Button>
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
            color="blue-gray"
            size="sm"
            onClick={() => setisCommandeeToNonPriseOpen(true)}
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Fixer les
            commandes
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
        ref={dt}
        value={commandes}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50, 100, 1000]}
        dataKey="id_commande"
        selectionMode="multiple"
        selection={selectedCommandes}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedCommandes(e.value);
          }
        }}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          'utilisateur.matricule_utilisateur',
          'code_commande',
          'etat_commande',
          'menu.date_menu',
          'date_commande',
        ]}
        emptyMessage="Aucune commande trouvée."
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        currentPageReportTemplate="Affichage du {first} au {last} des {totalRecords} entrées"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
        ></Column>
        <Column
          field="menu.date_menu"
          header="Date menu"
          sortable
          filterField="menu.date_menu"
          dataType="date"
          style={{ minWidth: '10rem' }}
          body={dateMenuBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          field="utilisateur.matricule_utilisateur"
          header="Matricule"
          sortable
          filterField="utilisateur.matricule_utilisateur"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
        />
        <Column
          field="code_commande"
          header="Code"
          sortable
          filterField="code_commande"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="etat_commande"
          header="Etat"
          sortable
          filterMenuStyle={{ width: '10rem' }}
          style={{ minWidth: '12rem' }}
          body={etatsBodyTemplate}
          filter
          editor={(options) => etatEditor(options)}
          filterElement={etatsFilterTemplate}
        />
        <Column
          field="date_commande"
          header="Date commande"
          sortable
          filterField="date_commande"
          dataType="date"
          style={{ minWidth: '10rem' }}
          body={dateCommandeBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
      </DataTable>
      <AjoutCommandeDialog
        open={isAjoutDialogOpen}
        utilisateursMatricule={matriculeOptions}
        handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
        onSubmit={handleAddCommmande}
      />
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
        onConfirm={onDeleteSelectedCommandes}
      />
      <SelectDateDialog
        open={isCommandeeToNonPriseOpen}
        handleOpen={() => setisCommandeeToNonPriseOpen((state) => !state)}
        onSubmit={handleUpdateAllCommandeComToNPFromDate}
      />
    </div>
  );
};

export default CommandeCrudTable;
