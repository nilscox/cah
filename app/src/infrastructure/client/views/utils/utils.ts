export const conditionalCallback = <Args extends unknown[]>(cb?: (...args: Args) => void, ...args: Args) => {
  if (!cb) {
    return;
  }

  return () => cb(...args);
};
