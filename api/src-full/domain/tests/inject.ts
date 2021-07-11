import Container, { Token } from 'typedi';

export const inject = <T, V>(token: Token<T>, value: V): V => {
  Container.set(token, value);
  return value;
};
