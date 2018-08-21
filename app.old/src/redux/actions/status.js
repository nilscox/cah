import { initialization } from './initialization';

const API_URL = process.env.REACT_APP_API_URL;
const CHECK_API_STATUS_INTERVAL = 4000;

export const API_UP = 'API_UP';
export const apiUp = () => ({
  type: API_UP,
});

export const API_DOWN = 'API_DOWN';
export const apiDown = () => ({
  type: API_DOWN,
});

export const CHECK_API_STATUS = 'CHECK_API_STATUS';
export const checkApiStatus = () => (dispatch, getState) => {
  dispatch({
    type: CHECK_API_STATUS,
    promise: fetch(API_URL + `/api/version`),
    meta: {
      onSuccess: () => {
        const { status } = getState();

        if (status.api === 'down') {
          dispatch(apiUp());
          dispatch(initialization());
        }
      },
      onFailure: (e) => {
        const { status } = getState();

        if (e.message === 'Network request failed') {
          if (status.api === 'up')
            dispatch(apiDown());

          setTimeout(() => dispatch(checkApiStatus()), CHECK_API_STATUS_INTERVAL);
        }
      },
    },
  });
};
