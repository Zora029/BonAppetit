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
import { Calendar } from 'primereact/calendar';
import {
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
  Typography,
} from '@material-tailwind/react';
import { FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

import AjoutIndisponibiliteDialog from '../dialog/AjoutIndisponibiliteDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';

import {
  IIndisponibilite,
  IIndisponibilitesFormData,
  IUtilisateur,
} from '@/types';
import IndisponibiliteService from '@/services/indisponibilite.service';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import UtilisateurService from '@/services/utilisateur.service';

interface IIndisponibilitesCrudTableProps {
  listeUtilisateur?: IUtilisateur[];
}

const IndisponibilitesCrudTable: React.FC<IIndisponibilitesCrudTableProps> = ({
  listeUtilisateur,
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date_ind: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    matricule_utilisateur: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
  };

  const [indisponibilites, setindisponibilites] = useState<IIndisponibilite[]>(
    [],
  );
  const [selectedIndisponibilites, setselectedIndisponibilites] = useState<
    IIndisponibilite[]
  >([]);
  const [matricules, setmatricules] = useState<string[]>([]);
  const [filters, setfilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  // Mounted
  useEffect(() => {
    retrieveIndisponibilites();
    retrieveDatas();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (listeUtilisateur) {
      const _matricules = listeUtilisateur.map((u) => u.matricule_utilisateur);
      setmatricules(_matricules);
    }
  }, [listeUtilisateur]);

  const retrieveIndisponibilites = async () => {
    try {
      const res = await IndisponibiliteService.getAll();
      setindisponibilites(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const retrieveDatas = async () => {
    try {
      if (!listeUtilisateur) {
        const res = await UtilisateurService.getAllIds();
        setmatricules(res.data);
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
    setfilters(defaultFilters);
    setGlobalFilterValue('');
  };

  const disableSupprimer = (): boolean => {
    return selectedIndisponibilites.length < 1;
  };

  const formatDate = (value: string | Date) => {
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Handler
  const handleAddIndisponibilite = async (ind: IIndisponibilitesFormData) => {
    try {
      await IndisponibiliteService.createMany(ind);
      setisAjoutDialogOpen(false);
      retrieveIndisponibilites();
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

    setfilters(_filters);
    setGlobalFilterValue(value);
  };

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { data, newData } = e;
    const newIndisponibilite: IIndisponibilite = {
      id_indisponibilite: newData.id_indisponibilite,
      date_ind: newData.date_ind,
      matricule_utilisateur: newData.matricule_utilisateur,
    };

    try {
      const res = await IndisponibiliteService.updateOne(
        data.id_indisponibilite,
        newIndisponibilite,
      );
      retrieveIndisponibilites();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedIndisponibilites = async () => {
    const selectedIndisponibiliteIds = selectedIndisponibilites.map(
      (val) => val.id_indisponibilite,
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await IndisponibiliteService.deleteMany(
        selectedIndisponibiliteIds,
      );
      retrieveIndisponibilites();
      setselectedIndisponibilites([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Templates
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

  const dateIndBodyTemplate = (rowData: IIndisponibilite) => {
    return formatDate(rowData.date_ind);
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

  const dateEditor = (options: ColumnEditorOptions) => {
    return (
      options && (
        <Calendar
          value={options.value}
          onChange={(e) => options.editorCallback?.(e.value)}
          className="max-w-[8rem]"
        />
      )
    );
  };

  return (
    <Card className="relative z-10 h-full w-full rounded-2xl shadow-none">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-4 flex shrink-0 flex-col justify-between sm:flex-row">
          <Button
            className="flex items-center gap-3"
            color="red"
            size="sm"
            onClick={() => setisSupprimerDialogOpen(true)}
            disabled={disableSupprimer()}
          >
            <MinusCircleIcon strokeWidth={2} className="h-4 w-4" /> Supprimer
          </Button>
          <Typography variant="h5" className="text-body">
            Indisponibilités
          </Typography>
          <Button
            className="flex items-center gap-3"
            size="sm"
            onClick={() => setisAjoutDialogOpen(true)}
          >
            <PlusCircleIcon strokeWidth={2} className="h-4 w-4" /> Ajout
          </Button>
        </div>
      </CardHeader>
      <CardBody className="overflow-auto px-0">
        <div className="w-full min-w-max">
          <DataTable
            value={indisponibilites}
            paginator
            rows={5}
            dataKey="id_indisponibilite"
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={['matricule_utilisateur', 'date_ind']}
            emptyMessage="Aucune indisponibilité trouvé."
            editMode="row"
            onRowEditComplete={onRowEditComplete}
            selectionMode={'multiple'}
            selection={selectedIndisponibilites}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setselectedIndisponibilites(e.value);
              }
            }}
            header={header}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column
              field="matricule_utilisateur"
              header="Matricule"
              sortable
              style={{ minWidth: '8rem' }}
              filter
            />
            <Column
              field="date_ind"
              header="Date"
              sortable
              filterField="date_ind"
              dataType="date"
              style={{ minWidth: '8rem' }}
              body={dateIndBodyTemplate}
              editor={(options) => dateEditor(options)}
              filter
              filterElement={dateFilterTemplate}
            />
            <Column
              rowEditor
              headerStyle={{ minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'center' }}
            ></Column>
          </DataTable>
        </div>
        <AjoutIndisponibiliteDialog
          open={isAjoutDialogOpen}
          handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
          onSubmit={handleAddIndisponibilite}
          utilisateursMatricule={matricules}
        />
        <ConfirmDeleteDialog
          open={isSupprimerDialogOpen}
          handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
          onConfirm={onDeleteSelectedIndisponibilites}
        />
      </CardBody>
    </Card>
  );
};

export default IndisponibilitesCrudTable;
