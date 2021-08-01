export const conditionalCallback = <Args extends any[]>(cb?: (...args: Args) => void, ...args: Args) => {
  if (!cb) {
    return;
  }

  return () => cb(...args);
};
