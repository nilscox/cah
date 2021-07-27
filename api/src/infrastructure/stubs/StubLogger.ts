import { LogArgs, Logger, LogLevel } from '../../application/interfaces/Logger';

export class StubLogger implements Logger {
  context?: string;

  setContext(context: string): void {
    this.context = context;
  }

  logs: Array<[LogLevel, string | Error, ...LogArgs]> = [];

  last(level: LogLevel) {
    const logs = this.logs.filter((log) => log[0] === level);
    const [, ...log] = logs[logs.length - 1];

    return log;
  }

  private register = (level: LogLevel) => {
    return (message: string | Error, ...args: LogArgs) => this.logs.push([level, message, ...args]);
  };

  debug = this.register('debug');
  verbose = this.register('verbose');
  info = this.register('info');
  warn = this.register('warn');
  error = this.register('error');
}
