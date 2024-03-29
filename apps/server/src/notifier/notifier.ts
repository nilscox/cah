import assert from 'node:assert';

import * as shared from '@cah/shared';
import { defined, hasId } from '@cah/utils';
import { injectableClass } from 'ditox';

import { EventPublisherPort, LoggerPort, RealEventPublisherAdapter, RtcPort } from 'src/adapters';
import { AnswerCreatedEvent } from 'src/commands/create-answer/create-answer';
import { GameCreatedEvent } from 'src/commands/create-game/create-game';
import { CardsDealtEvent } from 'src/commands/deal-cards/deal-cards';
import { GameEndedEvent } from 'src/commands/end-game/end-game';
import { TurnEndedEvent } from 'src/commands/end-turn/end-turn';
import { AllAnswersSubmittedEvent } from 'src/commands/handle-end-of-players-answer/handle-end-of-players-answer';
import { PlayerJoinedEvent } from 'src/commands/join-game/join-game';
import { PlayerLeftEvent } from 'src/commands/leave-game/leave-game';
import { AnswerSelectedEvent } from 'src/commands/select-winning-answer/select-winning-answer';
import { GameStartedEvent } from 'src/commands/start-game/start-game';
import { TurnStartedEvent } from 'src/commands/start-turn/start-turn';
import { isStarted } from 'src/entities';
import {
  AnswerRepository,
  ChoiceRepository,
  GameRepository,
  PlayerRepository,
  QuestionRepository,
  TurnRepository,
} from 'src/persistence';
import { PlayerConnectedEvent, PlayerDisconnectedEvent } from 'src/server/ws-server';
import { TOKENS } from 'src/tokens';

export class Notifier {
  static inject = injectableClass(
    this,
    TOKENS.logger,
    TOKENS.rtc,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.turn,
    TOKENS.repositories.player,
    TOKENS.repositories.choice,
    TOKENS.repositories.question,
    TOKENS.repositories.answer,
  );

  constructor(
    private readonly logger: LoggerPort,
    private readonly rtc: RtcPort,
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly turnRepository: TurnRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly choiceRepository: ChoiceRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly answerRepository: AnswerRepository,
  ) {
    this.logger.context = 'Notifier';
  }

  configure() {
    const publisher = this.publisher;
    assert(publisher instanceof RealEventPublisherAdapter);

    publisher.register(PlayerConnectedEvent, async (event) => {
      const playerId = event.entityId;
      const player = await this.playerRepository.findById(playerId);

      if (!player.gameId) {
        return;
      }

      await this.send(player.gameId, {
        type: 'player-connected',
        playerId: player.id,
      });
    });

    publisher.register(PlayerDisconnectedEvent, async (event) => {
      const playerId = event.entityId;
      const player = await this.playerRepository.findById(playerId);

      if (!player.gameId) {
        return;
      }

      await this.send(player.gameId, {
        type: 'player-disconnected',
        playerId: player.id,
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
      const player = await this.playerRepository.findById(event.playerId);

      await this.send(event.entityId, {
        type: 'player-joined',
        playerId: player.id,
        nick: player.nick,
      });
    });

    publisher.register(PlayerLeftEvent, async (event) => {
      await this.send(event.entityId, {
        type: 'player-left',
        playerId: event.playerId,
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

    publisher.register(TurnStartedEvent, async (event) => {
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
          blanks: question.blanks,
        },
      });
    });

    publisher.register(CardsDealtEvent, async (event) => {
      const player = await this.playerRepository.findById(event.entityId);
      const cards = await this.choiceRepository.findPlayerCards(event.entityId);

      await this.send(player.id, {
        type: 'cards-dealt',
        playerId: player.id,
        cards: event.choicesIds
          .map((choiceId) => defined(cards.find(hasId(choiceId))))
          .map((choice) => ({
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
      assert(shared.isStarted(game));
      assert(game.answers);

      await this.send(game.id, {
        type: 'all-players-answered',
        answers: game.answers.map((answer) => ({
          id: answer.id,
          choices: answer.choices,
        })),
      });
    });

    publisher.register(AnswerSelectedEvent, async (event) => {
      const game = await this.gameRepository.query(event.entityId);
      assert(shared.isStarted(game));
      assert(game.selectedAnswerId);

      await this.send(game.id, {
        type: 'winning-answer-selected',
        selectedAnswerId: game.selectedAnswerId,
        answers: game.answers as shared.Answer[],
      });
    });

    publisher.register(TurnEndedEvent, async (event) => {
      const turn = await this.turnRepository.query(event.turnId);

      await this.send(event.entityId, {
        type: 'turn-ended',
        turn,
      });
    });

    publisher.register(GameEndedEvent, async (event) => {
      await this.send(event.entityId, {
        type: 'game-ended',
      });
    });
  }

  private async send(to: string, event: shared.GameEvent) {
    this.logger.verbose('notify', to, event.type);
    await this.rtc.send(to, event);
  }
}
