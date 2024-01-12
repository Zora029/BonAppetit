import { IconButton } from '@material-tailwind/react';
import { ICommande } from '@/types';
import { TrashIcon } from '@heroicons/react/24/solid';

interface ICantineDashboardCardProps {
  commande: ICommande;
  onClick: () => void;
  onAnnuler: () => void;
}
const CantineDashboardCard: React.FC<ICantineDashboardCardProps> = ({
  commande,
  onClick,
  onAnnuler,
}) => {
  const getSeverity = (state: string) => {
    switch (state) {
      case 'annulée':
        return 'border-danger';

      case 'commandée':
        return 'border-success';

      case 'en attente':
        return 'border-warning';

      case 'livrée':
        return 'border-done';

      default:
        return 'border-done';
    }
  };

  const handleClickTrash = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onAnnuler();
  };
  return (
    <div
      className={`flex w-40 cursor-pointer items-center justify-between gap-2 rounded-2xl border-4 border-danger bg-white p-4 text-body shadow-soft-xl ${getSeverity(
        commande.etat_commande,
      )}`}
      onClick={onClick}
    >
      <div className="text-center">
        <p className="font-sans text-base font-semibold leading-normal">
          {commande.matricule_utilisateur}
        </p>
        <p className="text-xl font-bold text-black">{commande.code_commande}</p>
      </div>
      <div className="">
        <IconButton
          color="red"
          className="ml-auto flex h-10 w-10"
          onClick={handleClickTrash}
        >
          <TrashIcon className="h-6 w-6" />
        </IconButton>
      </div>
    </div>
  );
};

export default CantineDashboardCard;
