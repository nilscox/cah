import { RTCGateway } from '../../interfaces/gateways/RTCGateway';

import { WSAdapter } from './WSAdapter';

export class WSRTCGateway implements RTCGateway {
  constructor(private readonly ws: WSAdapter) {}

  async connect(): Promise<void> {
    await this.ws.connect('http://localhost:4242');
  }
}
