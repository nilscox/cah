import React from 'react';

import LobbyView from '../infrastructure/client/views/LobbyView/LobbyView';
import LoginView from '../infrastructure/client/views/LoginView/LoginView';

export default {
  title: 'Views',
};

export const LoginViewStory = () => <LoginView />;

LoginViewStory.storyName = 'LoginView';

export const LobbyViewStory = () => <LobbyView />;

LobbyViewStory.storyName = 'LobbyView';
