import { Log, LogLevel, LoggerPort } from './logger.port';

export class StubLoggerAdapter implements LoggerPort {
  context?: string;

  verbose: Log = (...args) => this.log('verbose', ...args);
  info: Log = (...args) => this.log('info', ...args);
  error: Log = (...args) => this.log('error', ...args);

  logs = new Map<LogLevel, unknown[]>([
    ['verbose', []],
    ['info', []],
    ['error', []],
  ]);

  private log(level: LogLevel, ...args: unknown[]) {
    this.logs.get(level)?.push(args);
  }
}
