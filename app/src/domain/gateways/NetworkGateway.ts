import { NetworkStatus } from '../../store/reducers/appStateReducer';

export interface NetworkGateway {
  networkStatus: NetworkStatus;
  onNetworkStatusChange(cb: (status: NetworkStatus) => void): void;
}
