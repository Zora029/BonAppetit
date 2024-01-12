import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import IngredientsCrudTable from '../table/IngredientsCrudTable';
interface IIngredientDialogProps {
  open: boolean;
  handleOpen: () => void;
}
const IngredientDialog: React.FC<IIngredientDialogProps> = ({
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
      <DialogHeader>Ajout ingredient</DialogHeader>
      <DialogBody>
        <IngredientsCrudTable />
      </DialogBody>
    </Dialog>
  );
};

export default IngredientDialog;
