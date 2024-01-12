import { PlusCircleIcon } from '@heroicons/react/24/solid';

interface IAddCardProps {
  label: string;
  onClickAdd: () => void;
}
const AddCard: React.FC<IAddCardProps> = ({ label, onClickAdd }) => {
  return (
    <div className="flex h-full w-[15rem] items-center justify-center rounded-xl border-4 border-dashed border-body">
      <div
        onClick={onClickAdd}
        className="flex cursor-pointer flex-col items-center gap-2 p-4"
      >
        <PlusCircleIcon className="h-10 w-10" />
        <p className="capitalize">Ajout {label}</p>
      </div>
    </div>
  );
};

export default AddCard;
