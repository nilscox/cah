import { Inject, Service } from 'typedi';

import { Player } from '../entities/Player';
import { PlayerRepository, PlayerRepositoryToken } from '../interfaces/PlayerRepository';

@Service()
export class Authenticate {
  @Inject(PlayerRepositoryToken)
  playerRepository!: PlayerRepository;

  async authenticate(nick: string): Promise<{ player: Player; created: boolean }> {
    const existing = await this.playerRepository.findByNick(nick);

    if (existing) {
      return { player: existing, created: false };
    }

    const created = await this.playerRepository.createPlayer(nick);

    return { player: created, created: true };
  }
}
