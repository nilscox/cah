import { GameEvent } from '@cah/shared';

import { EventPublisherPort, RealEventPublisherAdapter, RtcPort } from 'src/adapters';
import { AnswerCreatedEvent } from 'src/commands/create-answer/create-answer';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { CardsDealtEvent } from 'src/commands/deal-cards/deal-cards';
import { AllAnswersSubmittedEvent } from 'src/commands/handle-end-of-players-answer/handle-end-of-players-answer';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { GameStartedEvent } from 'src/commands/start-game/start-game';
import { isStarted } from 'src/entities';
import {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
} from 'src/persistence';
import { PlayerConnectedEvent } from 'src/server/ws-server';

export class Notifier {
  constructor(
    private readonly rtc: RtcPort,
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly answerRepository: AnswerRepository
  ) {}

  configure() {
    const publisher = this.publisher;
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(PlayerConnectedEvent, async (event) => {
      const playerId = event.entityId;
      const player = await this.playerRepository.findById(playerId);

      if (!player.gameId) {
        return;
      }

      const game = await this.gameRepository.findById(player.gameId);

      await this.send(game.id, {
        type: 'player-connected',
        nick: player.nick,
      });
    });

    publisher.register(GameCreatedEvent, async (event) => {
      const game = await this.gameRepository.findById(event.entityId);

      await this.send(game.id, {
        type: 'game-created',
        gameId: game.id,
        code: game.code,
      });
    });

    publisher.register(PlayerJoinedEvent, async (event) => {
      const playerId = event.playerId;
      const player = await this.playerRepository.findById(playerId);

      if (!player.gameId) {
        return;
      }

      const game = await this.gameRepository.findById(player.gameId);

      await this.send(game.id, {
        type: 'player-joined',
        gameId: game.id,
        playerId: player.id,
        nick: player.nick,
      });
    });

    publisher.register(GameStartedEvent, async (event) => {
      const game = await this.gameRepository.findById(event.entityId);
      assert(isStarted(game));

      await this.send(game.id, {
        type: 'game-started',
        gameId: game.id,
      });
    });

    publisher.register(GameStartedEvent, async (event) => {
      const game = await this.gameRepository.findById(event.entityId);
      assert(isStarted(game));

      const question = await this.questionRepository.findById(game.questionId);

      await this.send(game.id, {
        type: 'turn-started',
        gameId: game.id,
        questionMasterId: game.questionMasterId,
        question: {
          id: question.id,
          text: question.text,
        },
      });
    });

    publisher.register(CardsDealtEvent, async (event) => {
      const player = await this.playerRepository.findById(event.entityId);
      const cards = await this.choiceRepository.findPlayerCards(event.entityId);

      await this.send(player.id, {
        type: 'cards-dealt',
        playerId: player.id,
        cards: cards.map((choice) => ({
          id: choice.id,
          text: choice.text,
          caseSensitive: choice.caseSensitive,
        })),
      });
    });

    publisher.register(AnswerCreatedEvent, async (event) => {
      const answer = await this.answerRepository.findById(event.entityId);
      const game = await this.gameRepository.findById(answer.gameId);

      await this.send(game.id, {
        type: 'player-answered',
        playerId: answer.playerId,
      });
    });

    publisher.register(AllAnswersSubmittedEvent, async (event) => {
      const game = await this.gameRepository.query(event.entityId);
      assert(game.answers);

      await this.send(game.id, {
        type: 'all-players-answered',
        answers: game.answers.map((answer) => ({
          id: answer.id,
          choices: answer.choices,
        })),
      });
    });
  }

  private async send(to: string, event: GameEvent) {
    await this.rtc.send(to, event);
  }
}
