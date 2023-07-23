import { injectableClass } from 'ditox';

import { Log, LogLevel, LoggerPort } from './logger.port';

export class ConsoleLoggerAdapter implements LoggerPort {
  static inject = injectableClass(this);

  context?: string;

  verbose: Log = (...args) => this.log('verbose', ...args);
  info: Log = (...args) => this.log('info', ...args);
  error: Log = (...args) => this.log('error', ...args);

  private log(level: LogLevel, ...args: unknown[]) {
    const fn = {
      verbose: console.log,
      info: console.info,
      error: console.error,
    }[level];

    args.unshift('-');

    if (this.context) {
      args.unshift(`${this.context}`);
    }

    fn(`${this.date}`, `[${level}]`, ...args);
  }

  private get date() {
    const now = new Date();

    const date = [now.getFullYear(), now.getMonth() + 1, now.getDate()]
      .map((value) => String(value).padStart(2, '0'))
      .join('-');

    const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
      .map((value) => String(value).padStart(2, '0'))
      .join(':');

    const ms = String(now.getMilliseconds()).padEnd(3, '0');

    return `${date} ${time}.${ms}`;
  }
}
