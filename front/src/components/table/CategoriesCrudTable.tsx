/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { FilterMatchMode } from 'primereact/api';
import {
  DataTable,
  DataTableFilterMeta,
  DataTableRowEditCompleteEvent,
} from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  Input,
  Button,
  CardBody,
} from '@material-tailwind/react';

import AjoutCategorieDialog from '../dialog/AjoutCategorieDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';

import { ICategorie, ICategoriesFormData } from '@/types';
import CategorieService from '@/services/categorie.service';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';

const CategoriesCrudTable = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [categories, setcategories] = useState<ICategorie[]>([]);
  const [selectedCategories, setselectedCategories] = useState<ICategorie[]>(
    [],
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  // Mounted
  useEffect(() => {
    retrieveCategories();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveCategories = async () => {
    try {
      const res = await CategorieService.getAll();
      setcategories(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const disableSupprimer = (): boolean => {
    return selectedCategories.length < 1;
  };

  const initFilters = () => {
    setFilters(defaultFilters);
    setGlobalFilterValue('');
  };

  // Handler
  const handleAddCategorie = async (cat: ICategoriesFormData) => {
    try {
      await CategorieService.createOne(cat);
      setisAjoutDialogOpen(false);
      retrieveCategories();
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

  const onRowEditComplete = async (e: DataTableRowEditCompleteEvent) => {
    const { data, newData } = e;
    const newCategorie: ICategorie = {
      id_categorie: newData.id_categorie,
      nom_categorie: newData.nom_categorie,
      limite_categorie: newData.limite_categorie,
    };

    try {
      const res = await CategorieService.updateOne(
        data.id_categorie,
        newCategorie,
      );
      retrieveCategories();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedCategories = async () => {
    const selectedCategoriesIds = selectedCategories.map(
      (val) => val.id_categorie + '',
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await CategorieService.deleteMany(selectedCategoriesIds);
      retrieveCategories();
      setselectedCategories([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Templates
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-0">Liste des categories</h4>
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
  const textEditor = (options: ColumnEditorOptions) => {
    return (
      options && (
        <InputText
          type="text"
          value={options.value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            options.editorCallback?.(e.target.value)
          }
          className="max-w-[6rem] bg-blue-gray-100 px-2 py-1"
        />
      )
    );
  };

  return (
    <Card className="h-full w-full shadow-none">
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
            value={categories}
            paginator
            rows={5}
            dataKey="id_categorie"
            filters={filters}
            globalFilterFields={['id_categorie', 'nom_categorie']}
            emptyMessage="Aucun categorie trouvé."
            editMode="row"
            onRowEditComplete={onRowEditComplete}
            selectionMode={'multiple'}
            selection={selectedCategories}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setselectedCategories(e.value);
              }
            }}
            header={header}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column
              field="id_categorie"
              header="ID"
              sortable
              style={{ minWidth: '6rem' }}
              editor={(options) => textEditor(options)}
            />
            <Column
              field="nom_categorie"
              header="Nom"
              sortable
              style={{ minWidth: '6rem' }}
              editor={(options) => textEditor(options)}
            />
            <Column
              field="limite_categorie"
              header="Limite"
              sortable
              style={{ minWidth: '6rem' }}
              editor={(options) => textEditor(options)}
            />
            <Column
              rowEditor
              headerStyle={{ minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'center' }}
            ></Column>
          </DataTable>
        </div>
        <AjoutCategorieDialog
          open={isAjoutDialogOpen}
          handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
          onSubmit={handleAddCategorie}
        />
        <ConfirmDeleteDialog
          open={isSupprimerDialogOpen}
          handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
          onConfirm={onDeleteSelectedCategories}
        />
      </CardBody>
    </Card>
  );
};

export default CategoriesCrudTable;
