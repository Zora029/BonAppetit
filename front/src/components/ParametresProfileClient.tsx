import { useState } from 'react';
import Switcher from './inputs/Switcher';

const ParametresProfileClient = () => {
  const [isFollow, setisFollow] = useState(false);
  return (
    <div className="w-full max-w-full px-3 xl:w-4/12">
      <div className="shadow-soft-xl relative flex h-full min-w-0 flex-col break-words rounded-2xl border-0 bg-white bg-clip-border">
        <div className="mb-0 rounded-t-2xl border-b-0 bg-white p-4 pb-0">
          <h6 className="mb-0 font-semibold">Paramètres</h6>
        </div>
        <div className="flex-auto p-4">
          <h6 className="text-xs font-bold uppercase leading-tight text-blue-gray-500">
            Utilisation
          </h6>
          <ul className="mb-0 flex flex-col rounded-lg pl-0">
            <li className="relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
              <div className="flex flex-row items-center gap-2">
                <Switcher
                  id="ActivationRestrictions"
                  enabled={isFollow}
                  setEnabled={() => setisFollow(!isFollow)}
                />
                <label
                  htmlFor="ActivationRestrictions"
                  className="cursor-pointer text-sm"
                >
                  Toujours activer les réstrictions alimentaires pour le menu
                </label>
              </div>
            </li>
          </ul>
          <h6 className="mt-6 text-xs font-bold uppercase leading-tight text-blue-gray-500">
            Communication
          </h6>
          <ul className="mb-0 flex flex-col rounded-lg pl-0">
            <li className="relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
              <div className="flex flex-row items-center gap-2">
                <Switcher
                  id="ActiverRappels"
                  enabled={isFollow}
                  setEnabled={() => setisFollow(!isFollow)}
                />
                <label
                  htmlFor="ActiverRappels"
                  className="cursor-pointer text-sm"
                >
                  Activer les rappels de commandes non complétées
                </label>
              </div>
            </li>
            <li className="relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
              <div className="flex flex-row items-center gap-2">
                <Switcher
                  id="ActiverNotifEmail"
                  enabled={isFollow}
                  setEnabled={() => setisFollow(!isFollow)}
                />
                <label
                  htmlFor="ActiverNotifEmail"
                  className="cursor-pointer text-sm"
                >
                  Activer les notifications par e-mail
                </label>
              </div>
            </li>
            <li className="relative block rounded-t-lg border-0 bg-white px-0 py-2 text-inherit">
              <div className="flex flex-row items-center gap-2">
                <Switcher
                  id="ActiverNotifSms"
                  enabled={isFollow}
                  setEnabled={() => setisFollow(!isFollow)}
                />
                <label
                  htmlFor="ActiverNotifSms"
                  className="cursor-pointer text-sm"
                >
                  Activer les notifications par SMS
                </label>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParametresProfileClient;
