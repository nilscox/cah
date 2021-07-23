import { ServerStatus } from '../../store/reducers/appStateReducer';

export interface ServerGateway {
  healthcheck(): Promise<ServerStatus>;
}
