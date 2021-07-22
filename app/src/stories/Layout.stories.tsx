import React from 'react';

import { Meta } from '@storybook/react';

import Header from '../infrastructure/client/components/Header';
import { createPlayer } from '../utils/factories';

export default {
  title: 'Layout',
} as Meta;

export const HeaderStory = () => <Header player={createPlayer()} />;

HeaderStory.storyName = 'Header';
