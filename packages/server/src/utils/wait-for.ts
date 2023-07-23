export const waitFor = async <T>(check: () => T | Promise<T>, timeout = 1000): Promise<T> => {
  const start = Date.now();
  const elapsed = () => Date.now() - start;

  let error: unknown;

  while (elapsed() <= timeout) {
    try {
      return await check();
    } catch (err) {
      error = err;
      await new Promise((r) => setTimeout(r, 10));
    }
  }

  throw error ?? new Error('Timeout');
};
