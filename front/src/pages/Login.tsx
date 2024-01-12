import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import background from '@/assets/img/acceuil.jpeg';
import { Button, Input } from '@material-tailwind/react';
import { LockClosedIcon, UserIcon } from '@heroicons/react/24/solid';

import { ILoginData } from '@/types';
import { defaultLoginValue } from '@/database';
import { useAuth } from '@/contexts/AuthContext';
import AuthService from '@/services/auth.service';
import { errorHandler } from '@/utils';
import { useToast } from '@/contexts/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showToast } = useToast();
  const [formData, setformData] = useState<ILoginData>(defaultLoginValue);

  const clearInput = () => {
    setformData(defaultLoginValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setformData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await AuthService.login(formData);
      const user = response.data;

      if (user) {
        setUser(user);
        setTimeout(() => {
          switch (user.role) {
            case 'user':
              navigate('/', { replace: true });
              break;
            case 'cantine':
              navigate('/cantine/', { replace: true });
              break;
            case 'admin':
              navigate('/admin/', { replace: true });
              break;

            default:
              break;
          }
        }, 1000);
      }
      clearInput();
    } catch (error) {
      errorHandler(error, showToast);
    }
  };

  return (
    <div className="relative flex h-screen items-center text-white sm:justify-center">
      <img
        src={background}
        alt="login image"
        className="absolute h-full w-full object-cover object-center"
      />

      <form className="relative mx-6 rounded-2xl border-2 border-solid border-white bg-[#1a1a1a1a] px-6 py-10 backdrop-blur-md sm:w-[432px] sm:rounded-3xl sm:px-12 sm:pb-14 sm:pt-16">
        <h1 className="mb-8 text-center text-2xl font-medium sm:text-4xl">
          Login
        </h1>

        <div className="mb-10 flex flex-col gap-7">
          <div className="flex items-center gap-3">
            <UserIcon className="h-5 w-5" color="white" />

            <Input
              type="text"
              variant="standard"
              color="white"
              label="Matricule"
              name="matricule_utilisateur"
              value={formData.matricule_utilisateur}
              onChange={handleInputChange}
              crossOrigin={undefined}
            />
          </div>

          <div className="flex items-center gap-3">
            <LockClosedIcon className="h-5 w-5" color="white" />

            <Input
              type="password"
              variant="standard"
              color="white"
              label="Mot de passe"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleInputChange}
              crossOrigin={undefined}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          color="white"
          className="mb-8 p-4 font-medium"
          fullWidth
        >
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
