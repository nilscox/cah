// @flow

import type { ThunkAction } from 'Types/actions';

export const toggleSettingValue = (setting: string): ThunkAction => {
  return (dispatch, getState) => {
    const { settings } = getState();

    dispatch(setSettingValue(setting, !settings[setting]));
  };
};

export const SETTINGS_SET_VALUE = 'SETTINGS_SET_VALUE';
export const setSettingValue = (setting: string, value: any): ThunkAction => {
  return (dispatch, getState) => {
    const { settings } = getState();

    settings[setting] = value;
    localStorage.setItem('settings', JSON.stringify(settings));

    dispatch({
      type: SETTINGS_SET_VALUE,
      setting,
      value,
    });
  };
};

export const LOAD_SETTINGS = 'LOAD_SETTINGS';
export const loadSettings = (): ThunkAction => {
  return dispatch => {
    dispatch({ type: LOAD_SETTINGS });

    const settings = JSON.parse(localStorage.getItem('settings') || '{}');

    Object.keys(settings).forEach(key => {
      dispatch(setSettingValue(key, settings[key]));
    });
  };
};
