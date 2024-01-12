/* eslint-disable @typescript-eslint/no-explicit-any */
import { IShowToast } from '@/types';
import { createContext, useContext } from 'react';

interface ToastContextProps {
  showToast: IShowToast;
}

export const ToastContext = createContext<ToastContextProps | undefined>(
  undefined,
);

export const useToast = (): ToastContextProps => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
