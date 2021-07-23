import React from 'react';

import { Meta } from '@storybook/react';

import { createPlayer } from '../../../tests/factories';
import Header from '../components/Header';

export default {
  title: 'Layout',
} as Meta;

export const HeaderStory = () => <Header player={createPlayer()} />;

HeaderStory.storyName = 'Header';
