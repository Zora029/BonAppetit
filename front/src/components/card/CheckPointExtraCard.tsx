import { Button } from '@material-tailwind/react';

interface ICheckPointExtraCardProps {
  type: string;
  onClick: () => void;
}
const CheckPointExtraCard: React.FC<ICheckPointExtraCardProps> = ({
  type,
  onClick,
}) => {
  const getSeverity = (state: string) => {
    switch (state) {
      case 'Gardien':
        return 'bg-success';

      case 'Police':
        return 'bg-danger';

      case 'Visiteur':
        return 'bg-selected';

      case 'Extra':
        return 'bg-done';

      default:
        return 'bg-done';
    }
  };
  return (
    <div className="aspect-square w-1/2 p-1 lg:p-3">
      <Button
        onClick={onClick}
        className={`flex h-full w-full cursor-pointer items-center justify-center rounded-xl ${getSeverity(
          type,
        )} p-2.5 text-center font-bold text-white shadow-soft-2xl lg:text-xl`}
      >
        {type}
      </Button>
    </div>
  );
};

export default CheckPointExtraCard;
