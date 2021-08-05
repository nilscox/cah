import { ServerGateway } from '../../domain/gateways/ServerGateway';
import { NetworkStatus } from '../../store/reducers/appStateReducer';

export class FakeServerGateway implements ServerGateway {
  serverStatus = NetworkStatus.up;

  async healthcheck(): Promise<NetworkStatus> {
    return this.serverStatus;
  }
}
