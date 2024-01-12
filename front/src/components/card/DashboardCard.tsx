interface DashboardCardProps {
  nom: string;
  valeur: number;
  icon: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ nom, valeur, icon }) => {
  return (
    <div className="mb-6 w-full max-w-full px-3 sm:flex-none md:w-1/2 2xl:mb-0 2xl:w-1/4">
      <div className="relative flex min-w-0 flex-col break-words rounded-2xl bg-white bg-clip-border shadow-soft-xl">
        <div className="flex-auto p-4">
          <div className="-mx-3 flex flex-row">
            <div className="w-2/3 max-w-full flex-none px-3">
              <div>
                <p className="mb-0 font-sans text-sm font-semibold leading-normal">
                  {nom}
                </p>
                <p className="mb-0 text-base font-bold">{valeur}</p>
              </div>
            </div>
            <div className="basis-1/3 px-3 text-right">
              <div className="ml-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                {icon}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
