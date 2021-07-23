import { TimerGateway } from '../../domain/gateways/TimerGateway';

export class FakeTimerGateway implements TimerGateway {
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
