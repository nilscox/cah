import { NetworkGateway } from '../../domain/gateways/NetworkGateway';
import { NetworkStatus } from '../../store/reducers/appStateReducer';

export class FakeNetworkGateway implements NetworkGateway {
  networkStatus = NetworkStatus.up;

  listener?: (status: NetworkStatus) => void;

  onNetworkStatusChange(cb: (status: NetworkStatus) => void): void {
    this.listener = cb;
  }

  triggerNetworkStatusChange(status: NetworkStatus) {
    this.listener?.(status);
  }
}
