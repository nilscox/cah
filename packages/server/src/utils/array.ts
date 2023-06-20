export const array = <T>(length: number, createElement: (index: number) => T): T[] => {
  return Array(length)
    .fill(null)
    .map((_, index) => createElement(index));
};
