// @flow

export const toClassName = (list: Array<?mixed>): string => {
  return list.filter(s => s).join(' ');
};
