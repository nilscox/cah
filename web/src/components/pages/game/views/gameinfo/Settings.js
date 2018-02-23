// @flow

import * as React from 'react';
import { FormControlLabel, Checkbox, Button } from 'material-ui';

import type { SettingsType } from '../../../../../types/state';

type SettingsProps = {|
  settings: SettingsType,
  actions: {
    toggleDarkMode: Function,
    logout: Function,
  },
|};

const Settings = ({ settings, actions }: SettingsProps) => (
  <div className="settings">
    <div className="dark-mode">
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.darkMode}
            onChange={actions.toggleDarkMode}
          />
        }
        label="Dark mode"
      />
    </div>
    <Button onClick={actions.logout}>Log out</Button>
  </div>
);

export default Settings;
