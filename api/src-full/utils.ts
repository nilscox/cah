import util from 'util';

export type RequireField<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export const log = (obj: unknown) => {
  console.log(util.inspect(obj, { showHidden: false, depth: null, colors: true }));
};

export const randomString = () => {
  return Math.random().toString(36).slice(-6);
};
