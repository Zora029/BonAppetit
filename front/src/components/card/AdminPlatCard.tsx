import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from '@material-tailwind/react';

import { IPlat } from '@/types';
import { arrayBufferToBase64 } from '@/utils';

interface IplatCardProps {
  platData: IPlat;
}

const AdminPlatCard: React.FC<IplatCardProps> = ({ platData }) => {
  return (
    <Card
      shadow={false}
      color="transparent"
      className={`m-1 w-[15rem] self-start overflow-hidden shadow-lg`}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className={`m-0 h-32 overflow-hidden rounded-none ${
          platData.visuel_plat ? '' : 'hidden'
        }`}
      >
        {platData.visuel_plat && (
          <img
            src={`data:image/*;base64,${arrayBufferToBase64(
              platData.visuel_plat.data,
            )}`}
            alt="Visuel du plat"
          />
        )}

        <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
      </CardHeader>
      <CardBody className="p-2">
        <div className="mb-1 flex items-center justify-between">
          <Typography
            variant="lead"
            color="blue-gray"
            className="text-base font-medium"
          >
            {platData.nom_plat}
          </Typography>
        </div>
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="mb-1 text-xs font-medium"
        >
          De type {platData.categorie?.nom_categorie}
        </Typography>
        <ul className="inline-flex w-full list-none gap-1 overflow-hidden">
          {platData.ingredients &&
            platData.ingredients.map((ingredient, index) => (
              <li
                key={index}
                className="rounded-full border border-primary p-1 text-xs"
              >
                {ingredient.nom_ingredient}
              </li>
            ))}
        </ul>
      </CardBody>
      <CardFooter className="m-0 p-2">
        <Typography
          variant="paragraph"
          color="blue-gray"
          className="text-right text-xs font-medium"
        >
          Crée par{' '}
          <span className="font-bold">{platData.cantine?.nom_cantine}</span>
        </Typography>
      </CardFooter>
    </Card>
  );
};

export default AdminPlatCard;
