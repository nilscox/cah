import React, { useEffect, useState } from 'react';

import { action } from '@storybook/addon-actions';
import { Meta } from '@storybook/react';

import Button from '../components/Button';
import { Input } from '../components/Input';
import SubmittableInput from '../components/SubmittableInput';

export default {
  title: 'Form',
} as Meta;

export const ButtonStory = () => <Button onClick={action('click')}>Click me!</Button>;

ButtonStory.storyName = 'Button';

export const InputStory = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return <Input value={value} onTextChange={setValue} />;
};

InputStory.storyName = 'Input';

export const SubmittableInputStory = () => {
  const [value, setValue] = useState('');

  useEffect(() => {
    action('change')(value);
  });

  return <SubmittableInput value={value} onTextChange={setValue} onSubmit={action('submit')} />;
};

SubmittableInputStory.storyName = 'SubmittableInput';
