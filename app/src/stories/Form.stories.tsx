import React, { useEffect, useState } from 'react';

import { action } from '@storybook/addon-actions';

import Button from '../infrastructure/client/components/Button';
import { Input } from '../infrastructure/client/components/Input';
import SubmittableInput from '../infrastructure/client/components/SubmittableInput';

export default {
  title: 'Form',
};

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
