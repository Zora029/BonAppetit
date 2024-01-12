import icon from '@/assets/img/icons/icon-excel.svg';

interface IRapportCard1Props {
  onClick: (type: string) => void;
}

const RapportCard1: React.FC<IRapportCard1Props> = ({ onClick }) => {
  return (
    <div
      onClick={() => onClick('liste_commande')}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white bg-clip-border p-3 transition-all duration-300 hover:shadow-soft-xl"
    >
      <p className="text-sm">Liste des commandes</p>
      <img src={icon} alt="icon excel" className="h-10 w-10" />
    </div>
  );
};

export default RapportCard1;
