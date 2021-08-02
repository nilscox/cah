import { expect } from 'chai';

import { PlayState } from '../../../../shared/enums';
import { AnswerNotFoundError } from '../../domain/errors/AnswerNotFoundError';
import { InvalidPlayStateError } from '../../domain/errors/InvalidPlayStateError';
import { PlayerIsNotQuestionMasterError } from '../../domain/errors/PlayerIsNotQuestionMasterError';
import { Answer } from '../../domain/models/Answer';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { GameBuilder } from '../../utils/GameBuilder';
import { instanciateHandler } from '../../utils/injector';
import { instanciateStubDependencies } from '../../utils/stubDependencies';

import { SelectWinnerCommand, SelectWinnerHandler } from './SelectWinnerCommand';

describe('SelectWinnerCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: SelectWinnerHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, publisher, builder } = deps);

    handler = instanciateHandler(SelectWinnerHandler, deps);
  });

  const execute = (player: Player, answer: Answer) => {
    return handler.execute(new SelectWinnerCommand(answer.id), { player });
  };

  it('selects the winning answer', async () => {
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();
    const answer = game.answers[0];
    const winner = answer.player;

    await execute(game.questionMaster, answer);

    gameRepository.reload(game);

    expect(game.playState).to.eql(PlayState.endOfTurn);
    expect(game.winner).to.have.property('id', winner.id);

    expect(publisher.lastEvent).to.eql({ type: 'WinnerSelected', game });
  });

  it('does not select a winner when the answerId is not valid', async () => {
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();
    const player = game.playersExcludingQM[0];
    const answer = new Answer(player, game.question, player.getFirstCards(1));

    await expect(execute(game.questionMaster, answer)).to.be.rejectedWith(AnswerNotFoundError);
  });

  it('does not select a winner when the game play state is invalid', async () => {
    for (const playState of [PlayState.playersAnswer, PlayState.endOfTurn]) {
      const game = await builder.addPlayers().start().play(playState).get();
      const player = game.playersExcludingQM[0];
      const answer = new Answer(player, game.question, player.getFirstCards(1));

      const error = await expect(execute(game.questionMaster, answer)).to.be.rejectedWith(InvalidPlayStateError);
      expect(error).to.shallowDeepEqual({ expected: PlayState.questionMasterSelection, actual: playState });
    }
  });

  it('does not select a winner when the player is not the question master', async () => {
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();
    const player = game.playersExcludingQM[0];
    const answer = game.answers[0];

    const error = await expect(execute(player, answer)).to.be.rejectedWith(PlayerIsNotQuestionMasterError);
    expect(error).to.shallowDeepEqual({ player: { id: player.id } });
  });
});
