/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from 'react';
import { ToastContext } from './ToastContext';
import { Toast } from 'primereact/toast';
import { IShowToast } from '@/types';

interface IProviderProps {
  children: any;
}

const ToastProvider: React.FC<IProviderProps> = ({ children }) => {
  const toastRef = useRef<Toast>(null);

  const showToast: IShowToast = (severity, summary, detail) => {
    if (toastRef.current) {
      toastRef.current.show({ severity, summary, detail });
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
