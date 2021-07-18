import util from 'util';

export const log = (arg: unknown) => {
  console.log(util.inspect(arg, { depth: null, colors: true }));
};
