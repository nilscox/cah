import { NetworkStatus } from '../../reducers/appStateReducer';

import { appSlice } from './app.slice';

const { setNetworkStatus, setServerStatus, setAppReady, setNotification } = appSlice.actions;

export const appActions = {
  setNetworkStatus: (status: NetworkStatus) => {
    return setNetworkStatus({ status });
  },

  setServerStatus: (status: NetworkStatus) => {
    return setServerStatus({ status });
  },

  setAppReady: (ready = true) => {
    return setAppReady({ ready });
  },

  setNotification: (notification: string) => {
    return setNotification({ notification });
  },

  clearNotification: () => {
    return setNotification();
  },
};
