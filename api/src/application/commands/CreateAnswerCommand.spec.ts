import { expect } from 'chai';
import _ from 'lodash';

import { GameState } from '../../domain/enums/GameState';
import { PlayState } from '../../domain/enums/PlayState';
import { GameNotFoundError } from '../../domain/errors/GameNotFoundError';
import { InvalidChoicesSelectionError } from '../../domain/errors/InvalidChoicesSelectionError';
import { InvalidGameStateError } from '../../domain/errors/InvalidGameStateError';
import { InvalidNumberOfChoicesError } from '../../domain/errors/InvalidNumberOfChoicesError';
import { InvalidPlayStateError } from '../../domain/errors/InvalidPlayStateError';
import { PlayerAlreadyAnsweredError } from '../../domain/errors/PlayerAlreadyAnsweredError';
import { PlayerIsQuestionMasterError } from '../../domain/errors/PlayerIsQuestionMasterError';
import { PlayerNotFoundError } from '../../domain/errors/PlayerNotFoundError';
import { Blank } from '../../domain/models/Blank';
import { Choice } from '../../domain/models/Choice';
import { Player } from '../../domain/models/Player';
import { Question } from '../../domain/models/Question';
import { InMemoryGameRepository } from '../../infrastructure/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../infrastructure/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../infrastructure/StubEventPublisher';
import { StubExternalData } from '../../infrastructure/StubExternalData';
import { StubRandomService } from '../../infrastructure/StubRandomService';
import { GameBuilder } from '../../utils/GameBuilder';
import { GameService } from '../services/GameService';

import { CreateAnswerCommand, CreateAnswerCommandHandler } from './CreateAnswerCommand';

describe('CreateAnswerCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let gameService: GameService;
  let externalData: StubExternalData;
  let randomService: StubRandomService;
  let publisher: StubEventPublisher;

  let handler: CreateAnswerCommandHandler;

  beforeEach(() => {
    gameRepository = new InMemoryGameRepository();
    playerRepository = new InMemoryPlayerRepository();
    gameService = new GameService(playerRepository, gameRepository);
    externalData = new StubExternalData();
    randomService = new StubRandomService();
    publisher = new StubEventPublisher();

    handler = new CreateAnswerCommandHandler(gameService, randomService, publisher);
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
    expect(game.answers[0]).to.have.nested.property('player.id', player.id);
    expect(game.answers[0]).to.have.property('choices').that.have.length(1);
    expect(game.answers[0]).to.have.nested.property('question.id', game.question.id);

    expect(player.getCards()).to.have.length(10);

    expect(publisher.events).to.deep.include({ type: 'PlayerAnswered', game, player });
  });

  it('creates an answer with multiple choices', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(2);

    game.question = new Question('question', [new Blank(1), new Blank(2)]);

    await execute(player, choices);

    expect(game.answers).to.have.length(1);
    expect(game.answers[0]).to.have.property('choices').that.have.length(2);

    expect(player.getCards()).to.have.length(9);
  });

  it('enters in question master selection play state when the last player answers', async () => {
    const game = await builder.addPlayers().start().get();

    for (const player of game.playersExcludingQM) {
      await execute(player, player.getFirstCards(1));
    }

    expect(game.playState).to.eql(PlayState.questionMasterSelection);

    expect(publisher.events).to.deep.include({ type: 'AllPlayersAnswered', game });
  });

  it('randomizes the answers when the last player answers', async () => {
    const game = await builder.addPlayers().start().get();
    const players = game.playersExcludingQM;

    randomService.randomize = (array) => array.reverse();

    for (const player of players) {
      await execute(player, player.getFirstCards(1));
    }

    expect(game.answers.map((answer) => answer.player.id)).to.eql(players.reverse().map((player) => player.id));
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
    for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
      const game = await builder.addPlayers().start().play(playState).get();
      const player = game.playersExcludingQM[0];
      const choices = player.getFirstCards(1);

      const error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidPlayStateError);
      expect(error).to.shallowDeepEqual({ expected: PlayState.playersAnswer, actual: playState });
    }
  });

  it('does not create an answer when the player is the question master', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.questionMaster;
    const choices = player.getFirstCards(1);

    const error = await expect(execute(player, choices)).to.be.rejectedWith(PlayerIsQuestionMasterError);
    expect(error).to.have.nested.property('player.id', player.id);
  });

  it('does not create an answer when the player has already answered', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];

    await expect(execute(player, player.getFirstCards(1))).to.be.fulfilled;

    const error = await expect(execute(player, player.getFirstCards(1))).to.be.rejectedWith(PlayerAlreadyAnsweredError);
    expect(error).to.have.nested.property('player.id', player.id);
  });

  it('does not create an answer with choices that the player does not own', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = game.playersExcludingQM[1].getFirstCards(1);

    const error = await expect(execute(player, choices)).to.be.rejectedWith(InvalidChoicesSelectionError);
    expect(error).to.shallowDeepEqual({ player: { id: player.id }, choicesIds: _.map(choices, 'id') });
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
