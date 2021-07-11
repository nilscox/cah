import { expect } from 'chai';
import _ from 'lodash';

import {
  GameNotFoundError,
  InvalidChoicesSelectionError,
  InvalidGameStateError,
  InvalidNumberOfChoicesError,
  InvalidPlayStateError,
  PlayerAlreadyAnsweredError,
  PlayerIsQuestionMasterError,
  PlayerNotFoundError,
} from '../../domain/errors';
import { Choice } from '../../domain/models/Choice';
import { GameState, PlayState } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { Blank, Question } from '../../domain/models/Question';
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/InMemoryPlayerRepository';
import { StubExternalData } from '../../infrastructure/StubExternalData';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { CreateAnswerCommand, CreateAnswerCommandHandler } from './CreateAnswerCommand';

describe('CreateAnswerCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;

  let handler: CreateAnswerCommandHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    gameService = new GameService(playerRepository, gameRepository);
    externalData = new StubExternalData();

    handler = new CreateAnswerCommandHandler(gameService);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  const execute = (player: Player, choices: Choice[]) => {
    const choicesIds = _.map(choices, 'id');
    const command = new CreateAnswerCommand(player.id, choicesIds);

    return handler.execute(command);
  };

  it('creates an answer for the current turn', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(1);

    await execute(player, choices);

    expect(game.answers).to.have.length(1);
    expect(game.answers![0]).to.have.nested.property('player.id', player.id);
    expect(game.answers![0]).to.have.property('choices').that.have.length(1);
    expect(game.answers![0]).to.have.nested.property('question.id', game.question!.id);
  });

  it('creates an answer with multiple choices', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(2);

    game.question = new Question('question', [new Blank(1), new Blank(2)]);

    await execute(player, choices);

    expect(game.answers).to.have.length(1);
    expect(game.answers![0]).to.have.property('choices').that.have.length(2);
  });

  it('enters in question master selection play state when the last player answers', async () => {
    const game = await builder.addPlayers().start().get();

    for (const player of game.playersExcludingQM) {
      await execute(player, player.getFirstCards(1));
    }

    expect(game.playState).to.eql(PlayState.questionMasterSelection);
  });

  it('does not create an answer when the player does not exist', async () => {
    const player = new Player('player');
    const choices = [new Choice('choice 1')];

    await expect(execute(player, choices)).to.be.rejectedWith(PlayerNotFoundError);
  });

  it('does not create an answer when the player is not in a game', async () => {
    const player = new Player('player');
    const choices = [new Choice('choice 1')];

    player.addCards(choices);
    await playerRepository.save(player);

    await expect(execute(player, choices)).to.be.rejectedWith(GameNotFoundError);
  });

  it('does not create an answer when the game is not started', async () => {
    const game = await builder.addPlayers().get();
    const player = game.playersExcludingQM[0];
    const choices = [new Choice('choice 1')];

    player.addCards(choices);
    await playerRepository.save(player);

    const error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidGameStateError);
    expect(error).to.shallowDeepEqual({ expected: GameState.started, actual: GameState.idle });
  });

  it('does not create an answer when the game is not in play state players answer', async () => {
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(1);

    const error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidPlayStateError);
    expect(error).to.shallowDeepEqual({ expected: PlayState.playersAnswer, actual: PlayState.questionMasterSelection });
  });

  it('does not create an answer when the player is the question master', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.questionMaster!;
    const choices = player?.getFirstCards(1);

    const error = await expect(execute(player, choices)).to.be.rejectedWith(PlayerIsQuestionMasterError);
    expect(error).to.shallowDeepEqual({ player });
  });

  it('does not create an answer when the player has already answered', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(1);

    await expect(execute(player, choices)).to.be.fulfilled;

    const error = await expect(execute(player, choices)).to.be.rejectedWith(PlayerAlreadyAnsweredError);
    expect(error).to.shallowDeepEqual({ player });
  });

  it('does not create an answer with choices that the player does not own', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = [new Choice('choice 1')];

    const error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidChoicesSelectionError);
    expect(error).to.shallowDeepEqual({ player, choicesIds: _.map(choices, 'id') });
  });

  it('does not create an answer with an invalid number of choices', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(2);

    let error = await expect(execute(player, [])).to.be.rejectedWith(InvalidNumberOfChoicesError);
    expect(error).to.shallowDeepEqual({ expected: 1, actual: 0 });

    error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidNumberOfChoicesError);
    expect(error).to.shallowDeepEqual({ expected: 1, actual: 2 });
  });
});
