export const waitFor = async (check: () => unknown, timeout = 1000) => {
  const start = Date.now();
  const elapsed = () => Date.now() - start;

  let error: unknown;

  do {
    try {
      await check();
      error = undefined;
    } catch (err) {
      error = err;
      await new Promise((r) => setTimeout(r, 10));
    }

    if (elapsed() > timeout) {
      throw error ?? new Error('Timeout');
    }
  } while (error);
};
