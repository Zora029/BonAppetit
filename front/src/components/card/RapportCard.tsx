import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RapportCard1 from './RapportCard1';
import RapportCard2 from './RapportCard2';
import RapportSelectDateDialog from '../dialog/RapportSelectDateDialog';

import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import CommandeService from '@/services/commande.service';
import { listeCommandesPdf, rapportMensuelPdf } from '@/utils/generatePdf';

const RapportCard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [type, setType] = useState('liste_commande');
  const [isSelectDateOpen, setisSelectDateOpen] = useState<boolean>(false);

  const handleRapportCardClick = (type: string) => {
    setType(type);
    setisSelectDateOpen(true);
  };

  const generateRapport = async (date: string) => {
    try {
      if (type == 'liste_commande') {
        const res1 = await CommandeService.getCommandListForWeeklyReport(date);
        listeCommandesPdf(res1.data);
      } else if (type == 'rapport_mensuel') {
        // const res2 = await CommandeService.getDataForMonthlyReport(date);
        const res2 =
          await CommandeService.getCommandCountForMonthlyReport(date);
        rapportMensuelPdf(res2.data);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  return (
    <div className="border-black/12.5 relative z-20 flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid bg-white bg-clip-border shadow-soft-xl">
      <div className="flex-auto p-4">
        <div className="mb-4 rounded-xl bg-gradient-to-tl from-gray-900 to-slate-800 pr-1">
          <div className="relative h-full overflow-hidden rounded-xl bg-[url('/src/assets/img/curved-images/curved14.jpg')] bg-cover">
            <span className="absolute left-0 top-0 h-full w-full bg-gradient-to-tl from-gray-900 to-slate-800 bg-cover bg-center opacity-80"></span>
            <div className="relative z-10 flex h-full flex-auto flex-col p-4">
              <h5 className="mb-6 pt-2 font-bold text-white">
                Simplifiez votre quotidien avec notre application !
              </h5>
              <p className="text-xs text-white">
                Générez des rapports en un clin d'œil et automatisez les tâches
                fastidieuses.
              </p>
            </div>
          </div>
        </div>
        <h6 className="mb-0 ml-2 mt-6">Rapports :</h6>
        <div className="grid w-full grid-cols-2 gap-3">
          <RapportCard1 onClick={handleRapportCardClick} />
          <RapportCard2 onClick={handleRapportCardClick} />
        </div>
      </div>
      <RapportSelectDateDialog
        open={isSelectDateOpen}
        handleOpen={() => setisSelectDateOpen((state) => !state)}
        onSubmit={generateRapport}
      />
    </div>
  );
};

export default RapportCard;
