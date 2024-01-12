import { Progress, Typography } from '@material-tailwind/react';
import { ICantineOverviewTableData } from '@/types';
import { getDate } from '@/utils';

interface ICantineOverviewTableProps {
  data: ICantineOverviewTableData[];
}

const CantineOverviewTable: React.FC<ICantineOverviewTableProps> = ({
  data,
}) => {
  const header = [
    'nom',
    'type contrat',
    'debut contrat',
    'fin contrat',
    'repas maximal',
    'repas délivré',
    'completion',
  ];
  const handleCompletionColor = (val: number): 'blue' | 'red' | 'green' => {
    if (val < 90) {
      return 'blue';
    } else if (val < 100) {
      return 'red';
    } else {
      return 'green';
    }
  };
  return (
    <div className="relative flex min-w-0 flex-col break-words rounded-2xl border-0 border-solid border-black/10 bg-white bg-clip-border shadow-soft-xl">
      <div className="mb-0 rounded-t-2xl border-b-0 border-solid border-black/10 bg-white p-6 pb-0">
        <div className="-mx-3 mt-0 max-w-full px-3">
          <Typography variant="h5">Cantines</Typography>
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
                    className="letter border-b-solid text-xxs whitespace-nowrap border-b border-b-gray-200 bg-transparent px-6 py-3 text-left align-middle font-bold uppercase tracking-normal opacity-70"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((c, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold"> {c.nom_cantine} </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold"> {c.type_contrat} </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">
                      {getDate(c.debut_contrat)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">
                      {getDate(c.fin_contrat)}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold"> {c.nombre_repas} </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 text-center align-middle text-sm leading-normal">
                    <span className="font-semibold">
                      {c.nombre_commande_livree}
                    </span>
                  </td>
                  <td className="whitespace-nowrap border-b bg-transparent p-2 align-middle">
                    <div className="mx-auto w-3/4">
                      <div>
                        <div>
                          <span className="text-xs font-semibold leading-tight">
                            {c.nombre_repas > 1
                              ? Math.round(
                                  (c.nombre_commande_livree / c.nombre_repas) *
                                    100 *
                                    100,
                                ) / 100
                              : 0}
                            %
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={
                          c.nombre_repas > 1
                            ? Math.round(
                                (c.nombre_commande_livree / c.nombre_repas) *
                                  100 *
                                  100,
                              ) / 100
                            : 0
                        }
                        color={handleCompletionColor(
                          c.nombre_repas > 1
                            ? Math.round(
                                (c.nombre_commande_livree / c.nombre_repas) *
                                  100 *
                                  100,
                              ) / 100
                            : 0,
                        )}
                        className="w-28"
                      />
                    </div>
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

export default CantineOverviewTable;
