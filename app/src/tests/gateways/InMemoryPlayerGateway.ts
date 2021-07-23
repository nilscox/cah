import { Player } from '../../domain/entities/Player';
import { PlayerGateway } from '../../domain/gateways/PlayerGateway';

export class InMemoryPlayerGateway implements PlayerGateway {
  player?: Player;

  async fetchMe(): Promise<Player | undefined> {
    return this.player;
  }

  async login(nick: string): Promise<Player> {
    return {
      id: 'id',
      nick,
      isConnected: false,
    };
  }
}
