export interface TimerGateway {
  setTimeout(callback: () => void, ms: number): NodeJS.Timer;
  clearTimeout(timeout: NodeJS.Timer): void;

  setInterval(callback: () => void, ms: number): NodeJS.Timer;
  clearInterval(interval: NodeJS.Timer): void;
}
