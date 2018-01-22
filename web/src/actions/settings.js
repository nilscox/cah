export const toggleDarkMode = () => {
  return (dispatch, getState) => {
    const { settings } = getState();

    dispatch(setSettingValue('darkMode', !settings.darkMode));
  };
};

export const SETTINGS_SET_VALUE = 'SETTINGS_SET_VALUE';
export const setSettingValue = (setting, value) => {
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
export const loadSettings = () => {
  return dispatch => {
    dispatch({ type: LOAD_SETTINGS });

    let settings = localStorage.getItem('settings');
    if (settings) {
      settings = JSON.parse(settings);
      Object.keys(settings).forEach(key => {
        dispatch(setSettingValue(key, settings[key]));
      });
    }
  };
};
