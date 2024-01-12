import { useState } from 'react';

import { Button, ButtonGroup } from '@material-tailwind/react';

import IngredientDialog from '@/components/dialog/IngredientDialog';
import CategorieDialog from '@/components/dialog/CategorieDialog';
import AdminPlatsComplementsCRUD from '@/components/AdminPlatsComplementsCRUD';

const AdminPlatsComplements = () => {
  const [isIngredientDialogOpen, setisIngredientDialogOpen] =
    useState<boolean>(false);
  const [isCategorieDialogOpen, setisCategorieDialogOpen] =
    useState<boolean>(false);
  return (
    <div>
      <div className="mx-auto mb-4 w-[500px]">
        <ButtonGroup variant="text" fullWidth>
          <Button
            className="text-body"
            onClick={() => setisIngredientDialogOpen(true)}
          >
            Gérer les ingredients
          </Button>
          <Button
            className="text-body"
            onClick={() => setisCategorieDialogOpen(true)}
          >
            Gérer les catégories
          </Button>
        </ButtonGroup>
      </div>
      <AdminPlatsComplementsCRUD />

      <IngredientDialog
        open={isIngredientDialogOpen}
        handleOpen={() => setisIngredientDialogOpen(false)}
      />
      <CategorieDialog
        open={isCategorieDialogOpen}
        handleOpen={() => setisCategorieDialogOpen(false)}
      />
    </div>
  );
};

export default AdminPlatsComplements;
