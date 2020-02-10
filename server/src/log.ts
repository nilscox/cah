const formatedDate = () => {
  const now = new Date();

  return [
    [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-'),
    [
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    ].join(':')
  ].join(' ');
};

export const log = (...args: any[]) => {
  console.log([
    `[${formatedDate()}] `,
    ...args,
  ].filter(chunk => !!chunk).join(''));
};
