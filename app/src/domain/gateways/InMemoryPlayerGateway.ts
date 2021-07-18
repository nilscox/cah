import { Player } from '../../interfaces/entities/Player';
import { PlayerGateway } from '../../interfaces/gateways/PlayerGateway';

export class InMemoryPlayerGateway implements PlayerGateway {
  async fetchMe(): Promise<Player | undefined> {
    return;
  }

  async login(nick: string): Promise<Player> {
    return {
      id: 'id',
      nick,
      isConnected: false,
    };
  }
}
