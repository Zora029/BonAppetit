import icon from '@/assets/img/icons/icon-pdf.svg';

interface IRapportCard2Props {
  onClick: (type: string) => void;
}

const RapportCard2: React.FC<IRapportCard2Props> = ({ onClick }) => {
  return (
    <div
      onClick={() => onClick('rapport_mensuel')}
      className="flex cursor-pointer items-center justify-between gap-2 rounded-2xl bg-white bg-clip-border p-3 transition-all duration-300 hover:shadow-soft-xl"
    >
      <p className="text-sm">Rapport d'activités</p>
      <img src={icon} alt="icon excel" className="h-10 w-10" />
    </div>
  );
};

export default RapportCard2;
