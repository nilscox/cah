import { FullPlayerDto } from '../../../../shared/dtos';

export interface PlayerGateway {
  fetchMe(): Promise<FullPlayerDto | undefined>;
  login(nick: string): Promise<FullPlayerDto>;
  logout(): Promise<void>;
}
