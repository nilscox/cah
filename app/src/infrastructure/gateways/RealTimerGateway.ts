import { TimerGateway } from '../../interfaces/gateways/TimerGateway';

export class RealTimerGateway implements TimerGateway {
  setInterval(callback: () => void, ms: number): NodeJS.Timer {
    return setInterval(callback, ms);
  }

  clearInterval(interval: NodeJS.Timer): void {
    clearInterval(interval);
  }
}
