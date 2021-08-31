import { EventHandler } from '../../../ddd/EventHandler';
import { GameEvent } from '../../../domain/events';
import { Game, StartedGame } from '../../../domain/models/Game';
import { PlayState } from '../../../shared/enums';
import { GameEventDto } from '../../../shared/events';
import { GameRepository } from '../../interfaces/GameRepository';
import { Logger } from '../../interfaces/Logger';
import { Notifier } from '../../interfaces/Notifier';
import { DtoMapperService } from '../../services/DtoMapperService';

export class GameEventsHandler implements EventHandler<GameEvent> {
  constructor(
    private readonly logger: Logger,
    private readonly notifier: Notifier,
    private readonly gameRepository: GameRepository,
    private readonly dtoMapper: DtoMapperService,
  ) {
    this.logger.setContext('GameEvent');
  }

  async execute(event: GameEvent) {
    const notify = <Event extends GameEventDto>(eventDto: Event) => {
      this.notify(event.game, eventDto);
    };

    switch (event.type) {
      case 'PlayerConnected':
      case 'PlayerDisconnected':
        notify({ type: event.type, player: event.player.id });
        break;

      case 'GameJoined':
        notify({ type: event.type, player: this.dtoMapper.toPlayerDto(event.player) });
        break;

      case 'GameLeft':
        notify({ type: event.type, player: event.player.nick });
        break;

      case 'GameStarted':
        notify({
          type: event.type,
          totalQuestions: await this.gameRepository.getQuestionsCount(event.game.id),
        });

        break;

      case 'TurnStarted': {
        const { question, questionMaster } = event.game as StartedGame;

        notify({
          type: event.type,
          playState: PlayState.playersAnswer,
          question: question.toJSON(),
          questionMaster: questionMaster.id,
        });

        break;
      }

      case 'PlayerAnswered':
        notify({ type: event.type, player: event.player.id });
        break;

      case 'AllPlayersAnswered': {
        const { answers } = event.game as StartedGame;

        notify({
          type: event.type,
          answers: answers.map((answer) => this.dtoMapper.toAnswerDto(answer, true)),
        });

        break;
      }

      case 'WinnerSelected': {
        const { answers, winner } = event.game as StartedGame;

        notify({
          type: event.type,
          winner: winner!.id,
          answers: answers.map((answer) => this.dtoMapper.toAnswerDto(answer)),
        });

        break;
      }

      case 'TurnFinished':
      case 'GameFinished':
        notify({ type: event.type });
        break;
    }
  }

  private notify(game: Game, event: GameEventDto) {
    this.logger.info('notify', game.code, { type: event.type });
    this.logger.debug('notify', event);

    this.notifier.notifyGamePlayers(game, event);
  }
}
