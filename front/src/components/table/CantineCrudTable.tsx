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
import {
  TriStateCheckbox,
  TriStateCheckboxChangeEvent,
} from 'primereact/tristatecheckbox';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Button, Input, Typography } from '@material-tailwind/react';
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  MinusCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/solid';
import { FunnelIcon } from '@heroicons/react/24/outline';

import AjoutCantineDialog from '../dialog/AjoutCantineDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';

import { ICantine, ICantinesFormData } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import CantineService from '@/services/cantine.service';
import UtilisateurService from '@/services/utilisateur.service';

const CantineCrudTable = () => {
  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    nom_cantine: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    type_contrat: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    debut_contrat: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    fin_contrat: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    nombre_repas: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    matricule_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    actif: { value: null, matchMode: FilterMatchMode.EQUALS },
  };

  const navigate = useNavigate();
  const { showToast } = useToast();

  const [cantines, setCantines] = useState<ICantine[]>([]);
  const [selectedCantines, setSelectedCantines] = useState<ICantine[]>([]);
  const [matricules, setmatricules] = useState<string[]>([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  const disableSupprimer = (): boolean => {
    return selectedCantines.length < 1;
  };

  // Mounted
  useEffect(() => {
    retrieveCantines();
    retrieveDatas();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveCantines = async () => {
    try {
      const res = await CantineService.getAll();
      setCantines(getCantines(res.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      const res = await UtilisateurService.getAllIdsByRole('cantine');
      setmatricules(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const getCantines = (data: ICantine[]) => {
    return [...(data || [])].map((d) => {
      d.debut_contrat = new Date(d.debut_contrat);
      d.fin_contrat = new Date(d.fin_contrat);

      return d;
    });
  };

  // Handler
  const handleAddCantine = async (can: ICantinesFormData) => {
    try {
      await CantineService.createOne(can);
      setisAjoutDialogOpen(false);
      retrieveCantines();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { data, newData } = e;
    const newCantine: ICantine = {
      id_cantine: newData.id_cantine,
      nom_cantine: newData.nom_cantine,
      debut_contrat: newData.debut_contrat,
      fin_contrat: newData.fin_contrat,
      type_contrat: newData.type_contrat,
      nombre_repas: newData.nombre_repas,
      actif: newData.actif,
      matricule_utilisateur: newData.matricule_utilisateur,
    };

    try {
      const res = await CantineService.updateOne(data.id_cantine, newCantine);
      retrieveCantines();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedCantines = async () => {
    const selectedCantinesIds = selectedCantines.map((val) => val.id_cantine);
    setisSupprimerDialogOpen(false);

    try {
      const res = await CantineService.deleteMany(selectedCantinesIds);
      retrieveCantines();
      setSelectedCantines([]);
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

  const clearFilter = () => {
    initFilters();
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue('');
  };

  const formatDate = (value: string | Date) => {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const dateDebutContratBodyTemplate = (rowData: ICantine) => {
    return formatDate(rowData.debut_contrat);
  };

  const dateFinContratBodyTemplate = (rowData: ICantine) => {
    return formatDate(rowData.fin_contrat);
  };

  const actifBodyTemplate = (rowData: ICantine) => {
    return rowData.actif ? (
      <CheckCircleIcon className="h-5 w-5 text-success" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-danger" />
    );
  };

  const actifFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <div className="flex items-center gap-4">
        <label htmlFor="verified-filter" className="font-bold">
          Actif
        </label>
        <TriStateCheckbox
          id="verified-filter"
          value={options.value}
          className="rounded border border-blue-400"
          onChange={(e: TriStateCheckboxChangeEvent) =>
            options.filterCallback(e.value)
          }
        />
      </div>
    );
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

  const booleanEditor = (options: ColumnEditorOptions) => {
    return (
      options && (
        <Checkbox
          onChange={(e) => options.editorCallback?.(e.checked)}
          checked={options.value}
          className="shadow-soft-sm"
        ></Checkbox>
      )
    );
  };

  const dateEditor = (options: ColumnEditorOptions) => {
    return (
      options && (
        <Calendar
          value={options.value}
          onChange={(e) => options.editorCallback?.(e.value)}
          dateFormat="dd/mm/yy"
          placeholder="dd/mm/yyyy"
          mask="99/99/9999"
          className="max-w-[8rem]"
        />
      )
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
        <Typography variant="h5">Liste Cantines</Typography>
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
        value={cantines}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id_cantine"
        selectionMode="multiple"
        selection={selectedCantines}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedCantines(e.value);
          }
        }}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          'nom_cantine',
          'debut_contrat',
          'fin_contrat',
          'type_contrat',
          'nombre_repas',
          'matricule_utilisateur',
        ]}
        emptyMessage="Aucune cantine trouvée."
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        currentPageReportTemplate="Affichage du {first} au {last} des {totalRecords} entrées"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
        ></Column>
        <Column
          field="nom_cantine"
          header="Nom"
          sortable
          filterField="nom_cantine"
          style={{ minWidth: '8rem' }}
          filter
          filterPlaceholder="Rechercher"
          editor={(options) => textEditor(options)}
        />
        <Column
          field="type_contrat"
          header="Type contrat"
          sortable
          filterField="type_contrat"
          style={{ minWidth: '8rem' }}
          filter
          filterPlaceholder="Rechercher"
          editor={(options) => textEditor(options)}
        />
        <Column
          field="debut_contrat"
          header="Debut"
          sortable
          filterField="debut_contrat"
          dataType="date"
          style={{ minWidth: '10rem' }}
          body={dateDebutContratBodyTemplate}
          editor={(options) => dateEditor(options)}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          field="fin_contrat"
          header="Fin"
          sortable
          filterField="fin_contrat"
          dataType="date"
          style={{ minWidth: '10rem' }}
          body={dateFinContratBodyTemplate}
          editor={(options) => dateEditor(options)}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          field="nombre_repas"
          header="Nombre repas"
          sortable
          filterField="nombre_repas"
          style={{ minWidth: '8rem' }}
          filter
          filterPlaceholder="Rechercher"
          editor={(options) => textEditor(options)}
        />
        <Column
          field="matricule_utilisateur"
          header="Matricule"
          sortable
          filterField="matricule_utilisateur"
          style={{ minWidth: '8rem' }}
          filter
          filterPlaceholder="Rechercher"
          editor={(options) => textEditor(options)}
        />
        <Column
          field="actif"
          header="Actif"
          dataType="boolean"
          bodyClassName="text-center"
          style={{ minWidth: '8rem' }}
          body={actifBodyTemplate}
          editor={(options) => booleanEditor(options)}
          filter
          filterElement={actifFilterTemplate}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
      </DataTable>
      <AjoutCantineDialog
        open={isAjoutDialogOpen}
        utilisateursMatricule={matricules}
        handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
        onSubmit={handleAddCantine}
      />
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
        onConfirm={onDeleteSelectedCantines}
      />
    </div>
  );
};

export default CantineCrudTable;
