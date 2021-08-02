import { TimerGateway } from '../../domain/gateways/TimerGateway';

export class FakeTimerGateway implements TimerGateway {
  private timeout?: () => unknown;

  setTimeout(callback: () => unknown, _ms: number): NodeJS.Timer {
    this.timeout = callback;
    return {} as NodeJS.Timer;
  }

  clearTimeout(_timeout: NodeJS.Timer) {
    this.timeout = undefined;
  }

  invokeTimeout() {
    return this.timeout?.();
  }

  private interval?: () => unknown;

  setInterval(callback: () => unknown, _ms: number): NodeJS.Timer {
    this.interval = callback;
    return {} as NodeJS.Timer;
  }

  clearInterval(_interval: NodeJS.Timer) {
    this.interval = undefined;
  }

  invokeInterval() {
    return this.interval?.();
  }
}
