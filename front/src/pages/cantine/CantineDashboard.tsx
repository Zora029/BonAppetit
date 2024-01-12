import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

import CantineDashboardCard from '@/components/card/CantineDashboardCard';

import { ICommande } from '@/types';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';
import CommandeService from '@/services/commande.service';

const CantineDashboard = () => {
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
        _etat = 'livrée';
        break;

      case 'livrée':
        _etat = 'en attente';
        break;

      case 'annulée':
        _etat = 'en attente';
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

  const handleAnnulerClick = (com: ICommande) => {
    const commande = {
      id_commande: com.id_commande,
      etat_commande: 'annulée',
    };
    socket.emit('updateCommandeOfTheDay', commande);
  };

  return (
    <div className="flex min-h-full w-full">
      <div className="min-h-full w-1/2 px-3">
        <div className="flex h-full w-full flex-row flex-wrap content-start justify-center gap-6 overflow-auto rounded-2xl bg-white px-4 py-7 shadow-soft-xl">
          {commandes
            .filter((c) => c.etat_commande == 'en attente')
            .map((c, index) => (
              <CantineDashboardCard
                commande={c}
                key={index}
                onClick={() => handleCheckPointClick(c)}
                onAnnuler={() => handleAnnulerClick(c)}
              />
            ))}
        </div>
      </div>
      <div className="flex min-h-full w-1/2 flex-col gap-6 px-3">
        <div className="flex h-full w-full flex-row flex-wrap content-start justify-center gap-6 overflow-auto rounded-2xl bg-white p-4 shadow-soft-xl">
          {commandes
            .filter((c) => c.etat_commande == 'livrée')
            .map((c, index) => (
              <CantineDashboardCard
                commande={c}
                key={index}
                onClick={() => handleCheckPointClick(c)}
                onAnnuler={() => handleAnnulerClick(c)}
              />
            ))}
        </div>
        <div className="flex h-full w-full flex-row flex-wrap content-start justify-center gap-6 overflow-auto rounded-2xl bg-white p-4 shadow-soft-xl">
          {commandes
            .filter((c) => c.etat_commande == 'annulée')
            .map((c, index) => (
              <CantineDashboardCard
                commande={c}
                key={index}
                onClick={() => handleCheckPointClick(c)}
                onAnnuler={() => handleAnnulerClick(c)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default CantineDashboard;
