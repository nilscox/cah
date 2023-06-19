export type Log = (...args: unknown[]) => void;
export type LogLevel = Exclude<keyof LoggerPort, 'context'>;

export interface LoggerPort {
  context?: string;
  verbose: Log;
  info: Log;
  error: Log;
}
