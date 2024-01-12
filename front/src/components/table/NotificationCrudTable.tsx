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
import { Calendar } from 'primereact/calendar';
import {
  MagnifyingGlassIcon,
  MinusCircleIcon,
  PlusCircleIcon,
} from '@heroicons/react/24/solid';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Button, Input, Typography } from '@material-tailwind/react';

import AjoutNotificationDialog from '../dialog/AjoutNotificationDialog';
import ConfirmDeleteDialog from '../dialog/ConfirmDeleteDialog';

import { INotification, INotificationsFormData } from '@/types';
import { errorHandler, getDateTimeNow } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import NotificationService from '@/services/notification.service';

const NotificationCrudTable = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const defaultFilters: DataTableFilterMeta = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    date_notification: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    contenu_notification: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    lien_notification: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
    },
    type_notification: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    destinataire_notification: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
  };

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<
    INotification[]
  >([]);
  const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [isAjoutDialogOpen, setisAjoutDialogOpen] = useState<boolean>(false);
  const [isSupprimerDialogOpen, setisSupprimerDialogOpen] =
    useState<boolean>(false);

  const types = ['nouveau menu', 'rappel'];
  const destinataires = ['global', 'personnel'];

  // Mounted
  useEffect(() => {
    retrieveNotifications();
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveNotifications = async () => {
    try {
      const res = await NotificationService.getAll();
      setNotifications(getNotifications(res.data));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const getNotifications = (data: INotification[]) => {
    return [...(data || [])].map((d) => {
      d.date_notification = new Date(d.date_notification);

      return d;
    });
  };

  const disableSupprimer = (): boolean => {
    return selectedNotifications.length < 1;
  };

  const getSeverity = (etat: string) => {
    switch (etat) {
      case 'rappel':
        return 'danger';

      case 'nouveau menu':
        return 'success';

      case 'global':
        return 'info';

      case 'personnel':
        return 'warning';

      default:
        return null;
    }
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

  // Handler
  const handleAddNotification = async (notif: INotificationsFormData) => {
    try {
      await NotificationService.createOne(notif);
      setisAjoutDialogOpen(false);
      retrieveNotifications();
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
    const newNotification: INotification = {
      id_notification: newData.id_notification,
      contenu_notification: newData.contenu_notification,
      date_notification: getDateTimeNow(),
      destinataire_notification: newData.destinataire_notification,
      lien_notification: newData.lien_notification,
      type_notification: newData.type_notification,
    };

    try {
      const res = await NotificationService.updateOne(
        data.id_notification,
        newNotification,
      );
      retrieveNotifications();
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const onDeleteSelectedNotifications = async () => {
    const selectedNotificationsIds = selectedNotifications.map(
      (val) => val.id_notification,
    );
    setisSupprimerDialogOpen(false);

    try {
      const res = await NotificationService.deleteMany(
        selectedNotificationsIds,
      );
      retrieveNotifications();
      setSelectedNotifications([]);
      showToast('success', 'Succès', res.data.message);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  const dateNotificationBodyTemplate = (rowData: INotification) => {
    return formatDate(rowData.date_notification);
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

  const typeBodyTemplate = (rowData: INotification) => {
    return (
      <Tag
        value={rowData.type_notification}
        severity={getSeverity(rowData.type_notification)}
      />
    );
  };

  const destinataireBodyTemplate = (rowData: INotification) => {
    return (
      <Tag
        value={rowData.destinataire_notification}
        severity={getSeverity(rowData.destinataire_notification)}
      />
    );
  };

  const typeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={types}
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

  const destinataireFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <Dropdown
        value={options.value}
        options={destinataires}
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

  const typeEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={types}
        onChange={(e: DropdownChangeEvent) => options.editorCallback?.(e.value)}
        placeholder="Type"
        itemTemplate={(option) => {
          return <Tag value={option} severity={getSeverity(option)}></Tag>;
        }}
      />
    );
  };

  const destinataireEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        options={destinataires}
        onChange={(e: DropdownChangeEvent) => options.editorCallback?.(e.value)}
        placeholder="Selectionner"
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
        <Typography variant="h5">Liste Notifications</Typography>
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
        value={notifications}
        paginator
        header={header}
        rows={10}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        dataKey="id_notification"
        selectionMode="multiple"
        selection={selectedNotifications}
        onSelectionChange={(e) => {
          if (Array.isArray(e.value)) {
            setSelectedNotifications(e.value);
          }
        }}
        filters={filters}
        filterDisplay="menu"
        globalFilterFields={[
          'contenu_notification',
          'lien_notification',
          'type_notification',
          'destinataire_notification',
        ]}
        emptyMessage="Aucune notification trouvée."
        editMode="row"
        onRowEditComplete={onRowEditComplete}
        currentPageReportTemplate="Affichage du {first} au {last} des {totalRecords} entrées"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: '3rem' }}
        ></Column>
        <Column
          field="date_notification"
          header="Date"
          sortable
          filterField="date_notification"
          dataType="date"
          style={{ minWidth: '10rem' }}
          body={dateNotificationBodyTemplate}
          filter
          filterElement={dateFilterTemplate}
        />
        <Column
          field="type_notification"
          header="Type"
          sortable
          filterField="type_notification"
          filterMenuStyle={{ width: '10rem' }}
          style={{ minWidth: '12rem' }}
          body={typeBodyTemplate}
          filter
          editor={(options) => typeEditor(options)}
          filterElement={typeFilterTemplate}
        />
        <Column
          field="destinataire_notification"
          header="Destinataire"
          sortable
          filterField="destinataire_notification"
          filterMenuStyle={{ width: '10rem' }}
          style={{ minWidth: '12rem' }}
          body={destinataireBodyTemplate}
          filter
          editor={(options) => destinataireEditor(options)}
          filterElement={destinataireFilterTemplate}
        />
        <Column
          field="lien_notification"
          header="Lien"
          sortable
          filterField="lien_notification"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          field="contenu_notification"
          header="Contenu"
          sortable
          filterField="contenu_notification"
          filter
          filterPlaceholder="Rechercher"
          style={{ minWidth: '8rem' }}
          editor={(options) => textEditor(options)}
        />
        <Column
          rowEditor
          headerStyle={{ minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        ></Column>
      </DataTable>
      <AjoutNotificationDialog
        open={isAjoutDialogOpen}
        handleOpen={() => setisAjoutDialogOpen(!isAjoutDialogOpen)}
        onSubmit={handleAddNotification}
      />
      <ConfirmDeleteDialog
        open={isSupprimerDialogOpen}
        handleOpen={() => setisSupprimerDialogOpen(!isSupprimerDialogOpen)}
        onConfirm={onDeleteSelectedNotifications}
      />
    </div>
  );
};

export default NotificationCrudTable;
