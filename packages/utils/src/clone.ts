export const clone = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};
