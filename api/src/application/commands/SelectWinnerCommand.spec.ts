import { expect } from 'chai';

import { PlayState } from '../../domain/enums/PlayState';
import { AnswerNotFoundError } from '../../domain/errors/AnswerNotFoundError';
import { InvalidPlayStateError } from '../../domain/errors/InvalidPlayStateError';
import { PlayerIsNotQuestionMasterError } from '../../domain/errors/PlayerIsNotQuestionMasterError';
import { Answer } from '../../domain/models/Answer';
import { Player } from '../../domain/models/Player';
import { InMemoryGameRepository } from '../../infrastructure/repositories/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/repositories/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/stubs/StubEventPublisher';
import { StubExternalData } from '../../infrastructure/stubs/StubExternalData';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { SelectWinnerCommand, SelectWinnerHandler } from './SelectWinnerCommand';

describe('SelectWinnerCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;
  let publisher: StubEventPublisher;

  let handler: SelectWinnerHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    publisher = new StubEventPublisher();
    gameService = new GameService(playerRepository, gameRepository, publisher);
    externalData = new StubExternalData();

    handler = new SelectWinnerHandler(gameService);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  const execute = (player: Player, answer: Answer) => {
    const command = new SelectWinnerCommand(answer.id);

    return handler.execute(command, { player });
  };

  it('selects the winning answer', async () => {
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();
    const answer = game.answers[0];
    const winner = answer.player;

    await execute(game.questionMaster, answer);

    expect(game.playState).to.eql(PlayState.endOfTurn);
    expect(game.winner).to.eql(winner);

    expect(publisher.events).to.deep.include({ type: 'WinnerSelected', game });
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
