import { Player } from '../entities/Player';

export interface PlayerGateway {
  fetchMe(): Promise<Player | undefined>;
  login(nick: string): Promise<Player>;
}
