import { RTCGateway, RTCListener } from '../../domain/gateways/RTCGateway';

import { WSAdapter } from './WSAdapter';

export class WSRTCGateway implements RTCGateway {
  constructor(private readonly ws: WSAdapter) {}

  async connect(): Promise<void> {
    await this.ws.connect(process.env.WS_URL!);
  }

  onMessage(listener: RTCListener): void {
    this.ws.onMessage(listener);
  }
}
