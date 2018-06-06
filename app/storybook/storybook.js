import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { getStorybookUI, configure } from '@storybook/react-native';

// import stories
configure(() => {
  require('../src/components/Button/Button.stories.js');
  require('../src/components/PlayerAvatar/PlayerAvatar.stories.js');
  require('../src/screens/game/components/QuestionCard/QuestionCard.stories.js');
}, module);

// This assumes that storybook is running on the same host as your RN packager,
// to set manually use, e.g. host: 'localhost' option
const StorybookUIRoot = getStorybookUI({ port: 7007, onDeviceUI: true });

// react-native hot module loader must take in a Class - https://github.com/facebook/react-native/issues/10991
// https://github.com/storybooks/storybook/issues/2081
/* eslint-disable-next-line react/prefer-stateless-function, react/require-optimization */
class StorybookUIHMRRoot extends Component {
  render() {
    return <StorybookUIRoot />;
  }
}

AppRegistry.registerComponent('app', () => StorybookUIHMRRoot);
export default StorybookUIHMRRoot;
