import { Button } from '@material-tailwind/react';

interface ICheckPointPersonnelCardProps {
  matricule: string;
  etat: string;
  onClick: () => void;
  isDisabled: boolean;
}
const CheckPointPersonnelCard: React.FC<ICheckPointPersonnelCardProps> = ({
  matricule,
  etat,
  onClick,
  isDisabled,
}) => {
  const getSeverity = (state: string) => {
    switch (state) {
      case 'annulée':
        return 'bg-danger';

      case 'commandée':
        return 'bg-success';

      case 'en attente':
        return 'bg-warning';

      case 'livrée':
        return 'bg-done';

      default:
        return 'bg-done';
    }
  };
  return (
    <Button
      onClick={onClick}
      className={`flex h-20 w-20 cursor-pointer items-center justify-center rounded-xl ${getSeverity(
        etat,
      )} p-2.5 text-center text-xl font-bold text-white shadow-soft-2xl`}
      disabled={isDisabled}
    >
      {matricule}
    </Button>
  );
};

export default CheckPointPersonnelCard;
