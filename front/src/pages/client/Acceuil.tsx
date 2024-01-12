import { Button, Typography } from '@material-tailwind/react';
import { getDateNow } from '@/utils';
import { NavLink } from 'react-router-dom';

const Acceuil = () => {
  const now = getDateNow();
  return (
    <div className="absolute top-0 flex h-screen w-full items-center bg-[url(/src/assets/img/acceuil_hero.png)] bg-cover bg-center p-20">
      <div>
        <Typography className="mb-8 font-hero text-3xl font-bold md:text-5xl md:leading-tight lg:w-[50%] xl:text-6xl xl:leading-tight">
          Ce n'est pas juste un Déjeuner, C'est une Experience.
        </Typography>
        <div className="flex items-center gap-4 text-xs md:text-base">
          <NavLink to={`/menu/${now}`}>
            <Button className="rounded-full bg-primary">Voir Menu</Button>
          </NavLink>
          <NavLink to="/menu/">
            <Button variant="outlined" className="rounded-full">
              Faire une commande
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Acceuil;
