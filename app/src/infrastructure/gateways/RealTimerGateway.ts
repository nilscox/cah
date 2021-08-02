import { TimerGateway } from '../../domain/gateways/TimerGateway';

export class RealTimerGateway implements TimerGateway {
  setTimeout(callback: () => void, ms: number): NodeJS.Timer {
    return setTimeout(callback, ms);
  }

  clearTimeout(timeout: NodeJS.Timer): void {
    clearTimeout(timeout);
  }

  setInterval(callback: () => void, ms: number): NodeJS.Timer {
    return setInterval(callback, ms);
  }

  clearInterval(interval: NodeJS.Timer): void {
    clearInterval(interval);
  }
}
