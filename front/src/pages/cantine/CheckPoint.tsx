import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import DigitalClock from '@/components/DigitalClock';
import CheckPointExtraCard from '@/components/card/CheckPointExtraCard';
import CheckPointPersonnelCard from '@/components/card/CheckPointPersonnelCard';

import { ICommande } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import CommandeService from '@/services/commande.service';
import { extraMatricule } from '@/database';

const CheckPoint = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const socket = io('http://localhost:8080');

  const [commandes, setcommandes] = useState<ICommande[]>([]);

  // Mounted
  useEffect(() => {
    retrieveCommandes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveCommandes = async () => {
    try {
      const res = await CommandeService.getAllCommandesOfTheDayAPI();
      setcommandes(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };

  useEffect(() => {
    socket.on('reloadCommandesOfTheDay', (data) => {
      setcommandes(data);
    });

    // Nettoyage de la connexion lors du démontage du composant
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  // Handler
  const handleCheckPointClick = (com: ICommande) => {
    let _etat = '';
    switch (com.etat_commande) {
      case 'commandée':
        _etat = 'en attente';
        break;

      case 'en attente':
        _etat = 'commandée';
        break;
    }
    if (_etat) {
      const commande = {
        id_commande: com.id_commande,
        etat_commande: _etat,
      };
      socket.emit('updateCommandeOfTheDay', commande);
    }
  };

  const handleExtraCheckPointClick = (matricule: string) => {
    if (matricule) {
      const commande = {
        matricule_utilisateur: matricule,
        etat_commande: 'en attente',
      };
      socket.emit('extraPointage', commande);
    }
  };

  const isDisabled = (etat: string): boolean => {
    if (etat == 'livrée' || etat == 'annulée') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <main className="flex min-h-screen w-full p-4 lg:p-6 2xl:p-8">
      <div className="min-h-full w-8/12 px-3">
        <div className="flex h-full w-full flex-row flex-wrap content-start justify-center gap-6 overflow-auto rounded-2xl bg-white px-4 py-7 shadow-soft-xl">
          {commandes
            .filter((c) => !extraMatricule.includes(c.matricule_utilisateur))
            .map((com, index) => (
              <CheckPointPersonnelCard
                key={index}
                matricule={com.matricule_utilisateur}
                etat={com.etat_commande}
                onClick={() => handleCheckPointClick(com)}
                isDisabled={isDisabled(com.etat_commande)}
              />
            ))}
        </div>
      </div>
      <div className="min-h-full w-4/12 px-3">
        <div className="flex h-full w-full flex-col justify-between rounded-2xl bg-white p-4 shadow-soft-xl">
          <div className="flex aspect-square w-full flex-wrap">
            <CheckPointExtraCard
              type="Gardien"
              onClick={() => handleExtraCheckPointClick('GRD')}
            />
            <CheckPointExtraCard
              type="Police"
              onClick={() => handleExtraCheckPointClick('PLC')}
            />
            <CheckPointExtraCard
              type="Visiteur"
              onClick={() => handleExtraCheckPointClick('VST')}
            />
            <CheckPointExtraCard
              type="Extra"
              onClick={() => handleExtraCheckPointClick('EXT')}
            />
          </div>
          <div className="rounded-2xl border border-primary p-4 text-center font-body text-3xl font-bold text-primary lg:text-5xl">
            <DigitalClock />
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckPoint;
