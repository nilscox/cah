import React from 'react';

import Header from '../infrastructure/client/components/Header';
import { createPlayer } from '../utils/factories';

export default {
  title: 'Layout',
};

export const HeaderStory = () => <Header player={createPlayer()} />;

HeaderStory.storyName = 'Header';
