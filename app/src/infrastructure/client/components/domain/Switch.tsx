import { ReactElement } from 'react';

type SwitchProps<T extends Record<string, ReactElement>> = {
  options: T;
  value: keyof T;
};
export const Switch = <T extends Record<string, ReactElement>>({ options, value }: SwitchProps<T>) => {
  return options[value];
};
