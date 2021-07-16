import { EventHandler } from '../../ddd/EventHandler';
import { PlayState } from '../../domain/enums/PlayState';
import { GameEvent } from '../../domain/events';
import { Game, StartedGame } from '../../domain/models/Game';
import { Notifier } from '../interfaces/Notifier';

export class GameEventsHandler implements EventHandler {
  constructor(private readonly notifier: Notifier) {}

  execute(event: GameEvent) {
    switch (event.type) {
      case 'GameJoined':
        this.notify(event.game, {
          type: event.type,
          player: event.player.nick,
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
          winner: winner?.nick,
          answers: answers.map((answer) => answer.toJSON()),
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

  private notify(game: Game, event: unknown) {
    this.notifier.notifyGamePlayers(game, event);
  }
}
