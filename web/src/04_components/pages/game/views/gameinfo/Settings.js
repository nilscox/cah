// @flow

import * as React from 'react';
import { FormControlLabel, Checkbox, Button } from 'material-ui';

import type { SettingsType } from 'Types/state';

type SettingsProps = {|
  settings: SettingsType,
  actions: {
    toggleDarkMode: Function,
    toggleInstructions: Function,
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

    <div className="show-instructions">
      <FormControlLabel
        control={
          <Checkbox
            checked={settings.showInstructions}
            onChange={actions.toggleInstructions}
          />
        }
        label={(settings.showInstructions ? 'Hide' : 'Show') + " instructions"}
      />
    </div>

    <Button onClick={actions.logout}>Log out</Button>

  </div>
);

export default Settings;
