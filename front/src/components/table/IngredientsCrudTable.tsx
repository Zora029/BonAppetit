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

import AjoutIngredientDialog from '../dialog/AjoutIngredientDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';

import { IIngredient, IIngredientsFormData } from '@/types';
import { useToast } from '@/contexts/ToastContext';
import IngredientService from '@/services/ingredient.service';
import { errorHandler } from '@/utils';

const IngredientsCrudTable = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  };

  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);
  const [filters, setfilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
  const [ingredients, setingredients] = useState<IIngredient[]>([]);
  const [selectedIngredients, setselectedIngredients] = useState<IIngredient[]>(
    [],
  );

  const disableSupprimer = (): boolean => {
    return selectedIngredients.length < 1;
  };

  // Mounted
  useEffect(() => {
    retrieveIngredients();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveIngredients = async () => {
    try {
      const res = await IngredientService.getAll();
      setingredients(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const initFilters = () => {
    setfilters(defaultFilters);
    setGlobalFilterValue('');
  };

  // Handler
  const handleAddIngredient = async (ing: IIngredientsFormData) => {
    try {
      await IngredientService.createOne(ing);
      setisAjoutDialogOpen(false);
      retrieveIngredients();
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
    const newIngredient: IIngredient = {
      id_ingredient: newData.id_ingredient,
      nom_ingredient: newData.nom_ingredient,
    };

    try {
      const res = await IngredientService.updateOne(
        data.id_ingredient,
        newIngredient,
      );
      retrieveIngredients();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedIngredients = async () => {
    const selectedIngredientsIds = selectedIngredients.map(
      (val) => val.id_ingredient,
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await IngredientService.deleteMany(selectedIngredientsIds);
      retrieveIngredients();
      setselectedIngredients([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  // Templates
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h4 className="m-0">Liste des ingredients</h4>
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
          className="max-w-[10rem] bg-blue-gray-100 px-2 py-1"
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
            value={ingredients}
            paginator
            rows={5}
            dataKey="id_ingredient"
            filters={filters}
            globalFilterFields={['id_ingredient', 'nom_ingredient']}
            emptyMessage="Aucun ingredient trouvé."
            editMode="row"
            onRowEditComplete={onRowEditComplete}
            selectionMode={'multiple'}
            selection={selectedIngredients}
            onSelectionChange={(e) => {
              if (Array.isArray(e.value)) {
                setselectedIngredients(e.value);
              }
            }}
            header={header}
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
            ></Column>
            <Column
              field="nom_ingredient"
              header="Nom ingredient"
              sortable
              style={{ minWidth: '8rem' }}
              editor={(options) => textEditor(options)}
            />
            <Column
              rowEditor
              headerStyle={{ minWidth: '8rem' }}
              bodyStyle={{ textAlign: 'center' }}
            ></Column>
          </DataTable>
        </div>
        <AjoutIngredientDialog
          open={isAjoutDialogOpen}
          handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
          onSubmit={handleAddIngredient}
        />
        <ConfirmDeleteDialog
          open={isSupprimerDialogOpen}
          handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
          onConfirm={onDeleteSelectedIngredients}
        />
      </CardBody>
    </Card>
  );
};

export default IngredientsCrudTable;
