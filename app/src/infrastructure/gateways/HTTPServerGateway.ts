import { ServerGateway } from '../../domain/gateways/ServerGateway';
import { ServerStatus } from '../../store/reducers/appStateReducer';

import { HTTPAdapter } from './HTTPAdapter';

export class HTTPServerGateway implements ServerGateway {
  constructor(private readonly http: HTTPAdapter) {}

  async healthcheck(): Promise<ServerStatus> {
    try {
      await this.http.get('/healthcheck');

      return ServerStatus.up;
    } catch (error) {
      if ('response' in error && error.response === undefined) {
        return ServerStatus.down;
      }

      throw error;
    }
  }
}
