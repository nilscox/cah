import { NetworkStatus } from '../../store/reducers/appStateReducer';

export interface ServerGateway {
  healthcheck(): Promise<NetworkStatus>;
}
