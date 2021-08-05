import { ServerGateway } from '../../domain/gateways/ServerGateway';
import { NetworkStatus } from '../../store/reducers/appStateReducer';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPServerGateway implements ServerGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async healthcheck(): Promise<NetworkStatus> {
    try {
      await this.http.get('/healthcheck');

      return NetworkStatus.up;
    } catch (error) {
      if ('response' in error && error.response === undefined) {
        return NetworkStatus.down;
      }

      throw error;
    }
  }
}
