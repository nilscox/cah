export const array = <T>(size: number, createElement: (index: number) => T) => {
  return Array(size).fill(null).map(createElement);
};
