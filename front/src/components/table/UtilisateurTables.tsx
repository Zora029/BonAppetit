import { Typography } from '@material-tailwind/react';
import { Tag } from 'primereact/tag';
import { IUtilisateur } from '@/types';

interface IUtilisateurTablesProps {
  data: IUtilisateur[];
}

const UtilisateurTables: React.FC<IUtilisateurTablesProps> = ({ data }) => {
  const header = [
    'matricule',
    'poste',
    'nom',
    'prenom',
    'email',
    'tel',
    'role',
  ];
  const getSeverity = (role: string) => {
    switch (role) {
      case 'admin':
        return 'danger';

      case 'user':
        return 'success';

      default:
        return null;
    }
  };
  return (
    <div className="relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid border-black/10 bg-white bg-clip-border shadow-soft-xl">
      <div className="mb-0 rounded-t-2xl border-b-0 border-solid border-black/10 bg-white p-6 pb-0">
        <div className="-mx-3 mt-0 max-w-full px-3">
          <Typography variant="h5">Utilisateurs</Typography>
        </div>
      </div>
      <div className="flex-auto p-6 px-0 pb-2">
        <div className="overflow-x-auto">
          <table className="mb-0 w-full items-center border-gray-200 align-top">
            <thead className="align-bottom">
              <tr>
                {header.map((h, index) => (
                  <th
                    key={index}
                    className="letter border-b-solid text-xxs whitespace-nowrap border-b border-b-gray-200 bg-transparent px-6 py-3 text-center align-middle font-bold uppercase tracking-normal opacity-70"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((u, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">
                      {u.matricule_utilisateur}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">{u.poste_utilisateur}</span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold"> {u.nom_utilisateur} </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">
                      {u.prenom_utilisateur}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">{u.email_utilisateur}</span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold"> {u.tel_utilisateur} </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <Tag
                      value={u.role_utilisateur}
                      severity={getSeverity(u.role_utilisateur)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UtilisateurTables;
