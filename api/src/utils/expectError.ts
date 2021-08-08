import { expect, Expectation } from 'earljs';

export const expectError = async <T>(
  promise: Promise<unknown>,
  ...args: Parameters<Expectation<T>['toBeRejected']>
): Promise<Error> => {
  let error: Error | undefined;

  const saveError = (e: Error) => {
    error = e;
    throw e;
  };

  await expect(promise.catch(saveError)).toBeRejected(...args);

  return error as Error;
};
