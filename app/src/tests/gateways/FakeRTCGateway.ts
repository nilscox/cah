import { RTCGateway, RTCListener, RTCMessage } from '../../domain/gateways/RTCGateway';

export class FakeRTCGateway implements RTCGateway {
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
