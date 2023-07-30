export const compareByProperty = <T, K extends keyof T>(
  property: K,
  compare: (a: T[K], b: T[K]) => number,
): Parameters<Array<T>['sort']>[0] => {
  return (a: T, b: T) => compare(a[property], b[property]);
};
