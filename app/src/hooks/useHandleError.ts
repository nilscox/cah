import { useEffect } from 'react';

import { useTranslation } from 'react-i18next';
import { toast, Slide } from 'react-toastify';

type HandleErrorOpts = {
  message?: string | ((error: any) => string | undefined | false);
};

const useHandleError = (error?: any, { message }: HandleErrorOpts = {}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!error) {
      return;
    }

    const displayMessage = typeof message === 'function'
      ? message(error)
      : message;

    if (displayMessage === false)
      return;

    if (error.response) {
      console.log(error.message, error.response);
    } else {
      console.log(error);
    }

    toast.error(displayMessage || t('fallbackErrorMessage'), {
      position: toast.POSITION.BOTTOM_CENTER,
      hideProgressBar: true,
      className: 'toast toast-error',
      transition: Slide,
      draggablePercent: 30,
      closeButton: false,
    });
  }, [error]);
};

export default useHandleError;
