import { ServerGateway } from '../../domain/gateways/ServerGateway';
import { ServerStatus } from '../../store/reducers/appStateReducer';

export class FakeServerGateway implements ServerGateway {
  serverStatus = ServerStatus.up;

  async healthcheck(): Promise<ServerStatus> {
    return this.serverStatus;
  }
}
