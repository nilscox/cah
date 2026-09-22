export type ClassType<T> = {
  // oxlint-disable-next-line typescript/no-explicit-any
  new (...args: any[]): T;
};
