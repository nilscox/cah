import React from 'react';
import { FormControlLabel, Checkbox, Button } from 'material-ui';

const Settings = ({ settings, actions }) => (
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
