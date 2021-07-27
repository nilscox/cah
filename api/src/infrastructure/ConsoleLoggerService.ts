import util from 'util';

import { ConfigService } from '../application/interfaces/ConfigService';
import { isLogLevel, isLogLevelHigher, LogArgs, Logger, LogLevel } from '../application/interfaces/Logger';

export class ConsoleLoggerService implements Logger {
  private level: LogLevel = 'warn';
  private context?: string;

  constructor(configService: ConfigService) {
    const level = configService.get('LOG_LEVEL');

    if (level && isLogLevel(level)) {
      this.level = level;
    }
  }

  setContext(context: string) {
    this.context = context;
  }

  debug(message: string, ...args: LogArgs) {
    this.log('debug', message, ...args);
  }

  verbose(message: string, ...args: LogArgs) {
    this.log('verbose', message, ...args);
  }

  info(message: string, ...args: LogArgs) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: LogArgs) {
    this.log('warn', message, ...args);
  }

  error(error: Error, ...args: LogArgs) {
    this.log('error', error.message, ...args);
    this.log('error', error.stack ?? '<no stacktrace availabe>');
  }

  private log(level: LogLevel, message: string, ...args: LogArgs) {
    if (!isLogLevelHigher(this.level, level)) {
      return;
    }

    const func = {
      debug: console.debug,
      verbose: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
    }[level];

    const now = new Date();
    const time = now.toISOString().slice(-13, -1);

    const formatArgument = (arg: LogArgs[number]) => {
      if (typeof arg === 'object') {
        return util.inspect(arg, true, undefined, true);
      }

      return arg;
    };

    func(
      [time, `[${level}]`, this.context && `${this.context}:`, message].filter(Boolean).join(' '),
      ...args.map(formatArgument),
    );
  }
}
