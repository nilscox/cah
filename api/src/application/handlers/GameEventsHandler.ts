import _ from 'lodash';

import { AnswerDto } from '../../../../shared/dtos';
import { PlayState } from '../../../../shared/enums';
import { EventDto } from '../../../../shared/events';
import { EventHandler } from '../../ddd/EventHandler';
import { GameEvent } from '../../domain/events';
import { Game, StartedGame } from '../../domain/models/Game';
import { Logger } from '../interfaces/Logger';
import { Notifier } from '../interfaces/Notifier';
import { RTCManager } from '../interfaces/RTCManager';

export class GameEventsHandler implements EventHandler<GameEvent> {
  constructor(
    private readonly logger: Logger,
    private readonly notifier: Notifier,
    private readonly rtcManager: RTCManager,
  ) {
    this.logger.setContext('GameEvent');
  }

  execute(event: GameEvent) {
    switch (event.type) {
      case 'PlayerConnected':
      case 'PlayerDisconnected':
        this.notify(event.game, {
          type: event.type,
          player: event.player.nick,
        });
        break;

      case 'GameJoined':
        this.notify(event.game, {
          type: event.type,
          player: {
            ..._.pick(event.player, 'id', 'nick'),
            isConnected: this.rtcManager.isConnected(event.player),
          },
        });
        break;

      case 'GameStarted':
        this.notify(event.game, {
          type: event.type,
        });
        break;

      case 'TurnStarted': {
        const game = event.game as StartedGame;
        const { question, questionMaster } = game;

        this.notify(event.game, {
          type: event.type,
          playState: PlayState.playersAnswer,
          question: question.toJSON(),
          questionMaster: questionMaster.nick,
        });

        break;
      }

      case 'PlayerAnswered':
        this.notify(event.game, {
          type: event.type,
          player: event.player.nick,
        });
        break;

      case 'AllPlayersAnswered': {
        const game = event.game as StartedGame;
        const { answers } = game;

        this.notify(event.game, {
          type: event.type,
          answers: answers.map((answer) => answer.toJSON(true)),
        });

        break;
      }

      case 'WinnerSelected': {
        const game = event.game as StartedGame;
        const { answers, winner } = game;

        this.notify(event.game, {
          type: event.type,
          winner: winner!.nick,
          answers: answers.map((answer) => answer.toJSON() as AnswerDto),
        });

        break;
      }

      case 'TurnFinished':
        this.notify(event.game, { type: event.type });
        break;

      case 'GameFinished':
        this.notify(event.game, { type: event.type });
        break;
    }
  }

  private notify(game: Game, event: EventDto) {
    this.logger.info('notify', game.code, event.type);
    this.logger.verbose('notify', event);

    this.notifier.notifyGamePlayers(game, event);
  }
}
