import { RTCGateway, RTCListener, RTCMessage } from '../../interfaces/gateways/RTCGateway';

export class InMemoryRTCGateway implements RTCGateway {
  async connect(): Promise<void> {
    //
  }

  private listeners: RTCListener[] = [];

  onMessage(listener: RTCListener): void {
    this.listeners.push(listener);
  }

  triggerMessage(message: RTCMessage) {
    this.listeners.forEach((listener) => listener(message));
  }
}
