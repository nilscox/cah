import { hasProperty } from './has-property';

export const hasId = <T extends { id: string }>(id: string) => {
  return hasProperty<T, 'id'>('id', id);
};

export const getId = <T extends { id: string }>(obj: T) => {
  return obj.id;
};

export const getIds = <T extends { id: string }>(array: T[]) => {
  return array.map(getId);
};
