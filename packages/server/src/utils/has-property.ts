export const hasProperty = <T, K extends keyof T>(property: K, value: T[K]) => {
  return (item: T) => item[property] === value;
};
