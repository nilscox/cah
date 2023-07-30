import assert from 'node:assert';

import { hasId } from '@cah/utils';
import { injectableClass } from 'ditox';

import { EventPublisherPort } from 'src/adapters';
import { isStarted } from 'src/entities';
import { CommandHandler, DomainEvent } from 'src/interfaces';
import { AnswerRepository, GameRepository, PlayerRepository } from 'src/persistence';
import { TOKENS } from 'src/tokens';

export class AnswerSelectedEvent extends DomainEvent {
  constructor(gameId: string) {
    super('game', gameId);
  }
}

export type SelectWinningAnswerCommand = {
  playerId: string;
  answerId: string;
};

export class SelectWinningAnswerHandler implements CommandHandler<SelectWinningAnswerCommand> {
  static inject = injectableClass(
    this,
    TOKENS.publisher,
    TOKENS.repositories.game,
    TOKENS.repositories.player,
    TOKENS.repositories.answer,
  );

  constructor(
    private readonly publisher: EventPublisherPort,
    private readonly gameRepository: GameRepository,
    private readonly playerRepository: PlayerRepository,
    private readonly answerRepository: AnswerRepository,
  ) {}

  async execute(command: SelectWinningAnswerCommand): Promise<void> {
    const player = await this.playerRepository.findById(command.playerId);
    assert(player.gameId, 'player is not in a game');

    const game = await this.gameRepository.findById(player.gameId);
    assert(isStarted(game), 'game is not started');
    assert(player.id === game.questionMasterId, 'player is not the question master');
    assert(game.selectedAnswerId === undefined, 'an answer was already selected');

    const players = await this.playerRepository.findAllByGameId(game.id);

    const answers = await this.answerRepository.findForCurrentTurn(game.id);
    assert(answers.length === players.length - 1, 'not all player have submitted an answer');

    const answer = answers.find(hasId(command.answerId));
    assert(answer, 'invalid answerId');

    game.selectedAnswerId = answer.id;

    await this.gameRepository.update(game);

    this.publisher.publish(new AnswerSelectedEvent(game.id));
  }
}
