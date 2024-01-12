import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import CategoriesCrudTable from '../table/CategoriesCrudTable';
interface ICategorieDialogProps {
  open: boolean;
  handleOpen: () => void;
}
const CategorieDialog: React.FC<ICategorieDialogProps> = ({
  open,
  handleOpen,
}) => {
  return (
    <Dialog
      size="md"
      open={open}
      handler={handleOpen}
      className="min-h-[740px]"
    >
      <DialogHeader>Ajout Categorie</DialogHeader>
      <DialogBody>
        <CategoriesCrudTable />
      </DialogBody>
    </Dialog>
  );
};

export default CategorieDialog;
