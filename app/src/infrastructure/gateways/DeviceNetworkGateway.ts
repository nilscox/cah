import { NetworkGateway } from '../../domain/gateways/NetworkGateway';
import { NetworkStatus } from '../../store/reducers/appStateReducer';

export class DeviceNetworkGateway implements NetworkGateway {
  get networkStatus() {
    return navigator.onLine ? NetworkStatus.up : NetworkStatus.down;
  }

  onNetworkStatusChange(cb: (status: NetworkStatus) => void): void {
    window.addEventListener('online', () => cb(NetworkStatus.up));
    window.addEventListener('offline', () => cb(NetworkStatus.down));
  }
}
