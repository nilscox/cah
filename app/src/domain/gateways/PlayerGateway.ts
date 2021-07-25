import { FullPlayer } from '../entities/Player';

export interface PlayerGateway {
  fetchMe(): Promise<FullPlayer | undefined>;
  login(nick: string): Promise<FullPlayer>;
}
