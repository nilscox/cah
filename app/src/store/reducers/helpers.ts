export const append = <T>(array: T[], ...elements: T[]): T[] => {
  return [...array, ...elements];
};

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
const isFunction = (arg: any): arg is Function => typeof arg === 'function';

type Updater<T> = T | ((element: T) => T);
type PartialUpdater<T> = Partial<T> | ((element: T) => Partial<T>);

function update<T>(updater: Updater<T>, element: T): T;
function update<T>(updater: PartialUpdater<T>, element: T): T;

function update<T>(updater: Updater<T> | PartialUpdater<T>, element: T) {
  if (isFunction(updater)) {
    return updater(element);
  }

  return updater;
}

export const replace = <T>(array: T[], predicate: (element: T, index: number) => boolean, updater: Updater<T>): T[] => {
  const idx = array.findIndex(predicate);

  if (idx < 0) {
    return array;
  }

  // prettier-ignore
  return [
    ...array.slice(0, idx),
    update(updater, array[idx]),
    ...array.slice(idx + 1),
  ];
};

export const upsert = <T>(
  array: T[],
  predicate: (element: T, index: number) => boolean,
  updater: PartialUpdater<T>,
): T[] => {
  return replace(array, predicate, (element) => ({
    ...element,
    ...update(updater, element),
  }));
};

export const remove = <T>(array: T[], predicate: (element: T, index: number) => boolean): T[] => {
  const idx = array.findIndex(predicate);

  if (idx < 0) {
    return array;
  }

  // prettier-ignore
  return [
    ...array.slice(0, idx),
    ...array.slice(idx + 1),
  ];
};

export const isNull = (element: unknown): element is null => element === null;

export const findById =
  <I>(id: I) =>
  <T extends { id: I }>(element: T | null | undefined) => {
    return element?.id === id;
  };

export const filter = <T>(array: T[], predicate: (element: T) => boolean) => {
  return array.filter(predicate);
};

export const mapIds = <T extends { id: string }>(array: T[]) => {
  return array.map(({ id }) => id);
};
