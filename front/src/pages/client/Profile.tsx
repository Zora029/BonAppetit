import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ProfilePicture from '@/assets/img/profil.jpg';

import InformationProfileClient from '@/components/InformationProfileClient';
import NotificationsCard from '@/components/NotificationsCard';
import ParametresProfileClient from '@/components/ParametresProfileClient';

import { useToast } from '@/contexts/ToastContext';
import { arrayBufferToBase64, errorHandler } from '@/utils';
import { IUtilisateur } from '@/types';
import UtilisateurService from '@/services/utilisateur.service';

const Profile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [utilisateur, setutilisateur] = useState<IUtilisateur>({
    matricule_utilisateur: '',
    poste_utilisateur: '',
    nom_utilisateur: '',
    prenom_utilisateur: '',
    email_utilisateur: '',
    tel_utilisateur: '',
    role_utilisateur: 'user',
  });

  // Mounted
  useEffect(() => {
    retrieveUtilisateur();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const retrieveUtilisateur = async () => {
    try {
      const res = await UtilisateurService.getPersonalInformation();
      setutilisateur(res.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      errorHandler(err, showToast, navigate);
    }
  };
  return (
    <div className="xl:ml-68.5 relative text-body transition-all  duration-200 ease-in-out">
      {/* Header */}
      <div className="mx-auto w-full px-6">
        <div className="relative flex min-h-[100px] items-center overflow-hidden rounded-2xl bg-[url(/src/assets/img/curved-images/curved0.jpg)] bg-cover bg-center p-0">
          <span className="absolute inset-y-0 h-full w-full bg-gradient-to-tl from-purple-700 to-pink-500 bg-cover bg-center opacity-60"></span>
        </div>
        <div className="relative mx-6 -mt-16 flex min-w-0 flex-auto flex-col overflow-hidden break-words rounded-2xl border-0 bg-white/80 bg-clip-border p-4 shadow-blur backdrop-blur-2xl backdrop-saturate-200">
          <div className="-mx-3 flex flex-wrap">
            <div className="w-auto max-w-full flex-none px-3">
              <div className="ease-soft-in-out relative inline-flex h-16 w-16 items-center justify-center rounded-xl text-base text-white transition-all duration-200">
                <img
                  src={
                    utilisateur?.profil_utilisateur
                      ? `data:image/*;base64,${arrayBufferToBase64(
                          utilisateur?.profil_utilisateur.data,
                        )}`
                      : ProfilePicture
                  }
                  alt="profile_image"
                  className="w-full rounded-xl shadow-soft-sm"
                />
              </div>
            </div>
            <div className="my-auto w-auto max-w-full flex-none px-3">
              <div className="h-full">
                <h5 className="mb-1">
                  {utilisateur?.nom_utilisateur +
                    ' ' +
                    utilisateur?.prenom_utilisateur}
                </h5>
                <p className="mb-0 text-sm font-semibold uppercase leading-normal">
                  {utilisateur?.role_utilisateur}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="mx-auto flex w-full flex-wrap p-2 md:p-6">
        {/* Parametre */}
        <ParametresProfileClient />
        {/* Profile Information */}
        <InformationProfileClient user={utilisateur} />
        {/* Notifications */}
        <NotificationsCard />
      </div>
    </div>
  );
};

export default Profile;
