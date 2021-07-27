const levels = ['debug', 'verbose', 'info', 'warn', 'error'] as const;

export type LogLevel = typeof levels[number];

export const isLogLevel = (str: string): str is LogLevel => {
  return levels.includes(str as LogLevel);
};

export const isLogLevelHigher = (current: LogLevel, than: LogLevel) => {
  const currentIdx = levels.indexOf(current);
  const thanIdx = levels.indexOf(than);

  return thanIdx >= currentIdx;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogArgs = any[];

export interface Logger {
  setContext(context: string): void;

  debug(message: string, ...args: LogArgs): void;
  verbose(message: string, ...args: LogArgs): void;
  info(message: string, ...args: LogArgs): void;
  warn(message: string, ...args: LogArgs): void;
  error(error: Error, ...args: LogArgs): void;
}
