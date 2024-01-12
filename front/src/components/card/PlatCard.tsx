import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  IconButton,
} from '@material-tailwind/react';

import { IPlat } from '@/types';
import { arrayBufferToBase64 } from '@/utils';

interface IplatCardProps {
  platData: IPlat;
  onAdorer: () => void;
}

const PlatCard: React.FC<IplatCardProps> = ({ platData, onAdorer }) => {
  return (
    <Card
      shadow={false}
      color="transparent"
      className={`m-1 w-[15rem] self-start overflow-hidden shadow-lg`}
    >
      <CardHeader
        floated={false}
        shadow={false}
        className={`m-0 h-28 overflow-hidden rounded-none ${
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
        <IconButton
          size="sm"
          color="red"
          variant="text"
          className="!absolute right-4 top-4 rounded-full"
          onClick={onAdorer}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={platData.isAdorer ? 'currentColor' : 'none'}
            strokeWidth={platData.isAdorer ? 0 : 1.5}
            stroke="black"
            className="h-6 w-6"
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        </IconButton>
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
          {!platData.visuel_plat && (
            <IconButton
              size="sm"
              color="red"
              variant="text"
              className="rounded-full"
              onClick={onAdorer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={platData.isAdorer ? 'currentColor' : 'none'}
                strokeWidth={platData.isAdorer ? 0 : 1.5}
                stroke="black"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"
                />
              </svg>
            </IconButton>
          )}
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

export default PlatCard;
