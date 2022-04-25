import { FullPlayer } from '../../domain/entities/Player';
import { PlayerGateway } from '../../domain/gateways/PlayerGateway';

export class FakePlayerGateway implements PlayerGateway {
  player?: FullPlayer;

  async fetchMe(): Promise<FullPlayer | undefined> {
    return this.player;
  }

  async login(nick: string): Promise<FullPlayer> {
    return {
      id: 'id',
      nick,
      cards: [],
      isConnected: false,
      hasFlushed: false,
    };
  }

  async logout(): Promise<void> {
    this.player = undefined;
  }
}
