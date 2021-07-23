import React from 'react';

import { Meta } from '@storybook/react';

import LobbyView from '../views/LobbyView/LobbyView';
import LoginView from '../views/LoginView/LoginView';

export default {
  title: 'Views',
} as Meta;

export const LoginViewStory = () => <LoginView />;

LoginViewStory.storyName = 'LoginView';

export const LobbyViewStory = () => <LobbyView />;

LobbyViewStory.storyName = 'LobbyView';
