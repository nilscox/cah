export interface TimerGateway {
  setInterval(callback: () => void, ms: number): NodeJS.Timer;
  clearInterval(interval: NodeJS.Timer): void;
}
