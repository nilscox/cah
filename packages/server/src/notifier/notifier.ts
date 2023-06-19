import { EventPublisherPort, RealEventPublisherAdapter, RtcPort } from 'src/adapters';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { GameRepository, PlayerRepository } from 'src/persistence';
import { PlayerConnectedEvent } from 'src/server/ws-server';

export class Notifier {
  constructor(
    private readonly rtc: RtcPort,
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository
  ) {}

  configure() {
    const publisher = this.publisher;
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(PlayerConnectedEvent, async (event) => {
      const playerId = event.entityId;
      const player = await this.playerRepository.findByIdOrFail(playerId);

      if (!player.gameId) {
        return;
      }

      const game = await this.gameRepository.findByIdOrFail(player.gameId);

      await this.rtc.send(game.id, { type: 'player-connected', player });
    });

    publisher.register(PlayerJoinedEvent, async (event) => {
      const playerId = event.playerId;
      const player = await this.playerRepository.findByIdOrFail(playerId);

      if (!player.gameId) {
        return;
      }

      const game = await this.gameRepository.findByIdOrFail(player.gameId);

      await this.rtc.send(game.id, { type: 'player-joined', player });
    });
  }
}
