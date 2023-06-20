import { GameEvent } from '@cah/shared';

import { EventPublisherPort, RealEventPublisherAdapter, RtcPort } from 'src/adapters';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { GameStartedEvent } from 'src/commands/start-game/start-game';
import { isStarted } from 'src/entities';
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

      await this.send(game.id, {
        type: 'player-connected',
        nick: player.nick,
      });
    });

    publisher.register(GameCreatedEvent, async (event) => {
      const game = await this.gameRepository.findByIdOrFail(event.entityId);

      await this.send(game.id, {
        type: 'game-created',
        gameId: game.id,
        code: game.code,
      });
    });

    publisher.register(PlayerJoinedEvent, async (event) => {
      const playerId = event.playerId;
      const player = await this.playerRepository.findByIdOrFail(playerId);

      if (!player.gameId) {
        return;
      }

      const game = await this.gameRepository.findByIdOrFail(player.gameId);

      await this.send(game.id, {
        type: 'player-joined',
        nick: player.nick,
        gameId: game.id,
      });
    });

    publisher.register(GameStartedEvent, async (event) => {
      const game = await this.gameRepository.findByIdOrFail(event.entityId);
      assert(isStarted(game));

      await this.send(game.id, {
        type: 'game-started',
        gameId: game.id,
        questionMasterId: game.questionMasterId,
        questionId: game.questionId,
      });
    });
  }

  private async send(to: string, event: GameEvent) {
    await this.rtc.send(to, event);
  }
}
