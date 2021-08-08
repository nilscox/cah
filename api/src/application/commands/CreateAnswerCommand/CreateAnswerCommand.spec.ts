import { expect } from 'earljs';
import _ from 'lodash';

import { GameState, PlayState } from '../../../../../shared/enums';
import { GameNotFoundError } from '../../../domain/errors/GameNotFoundError';
import { InvalidChoicesSelectionError } from '../../../domain/errors/InvalidChoicesSelectionError';
import { InvalidGameStateError } from '../../../domain/errors/InvalidGameStateError';
import { InvalidNumberOfChoicesError } from '../../../domain/errors/InvalidNumberOfChoicesError';
import { InvalidPlayStateError } from '../../../domain/errors/InvalidPlayStateError';
import { PlayerAlreadyAnsweredError } from '../../../domain/errors/PlayerAlreadyAnsweredError';
import { PlayerIsQuestionMasterError } from '../../../domain/errors/PlayerIsQuestionMasterError';
import { Blank } from '../../../domain/models/Blank';
import { Choice } from '../../../domain/models/Choice';
import { Game } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { Question } from '../../../domain/models/Question';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubEventPublisher } from '../../../infrastructure/stubs/StubEventPublisher';
import { StubRandomService } from '../../../infrastructure/stubs/StubRandomService';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { expectError } from '../../../utils/expectError';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { CreateAnswerCommand, CreateAnswerHandler } from './CreateAnswerCommand';

describe('CreateAnswerCommand', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let randomService: StubRandomService;
  let publisher: StubEventPublisher;
  let builder: GameBuilder;

  let handler: CreateAnswerHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, randomService, publisher, builder } = deps);

    handler = instanciateHandler(CreateAnswerHandler, deps);
  });

  const execute = async (game: Game | undefined, player: Player, choices: Choice[]) => {
    const choicesIds = _.map(choices, 'id');
    const command = new CreateAnswerCommand(choicesIds);

    await handler.execute(command, { player });

    gameRepository.reload(game);
    playerRepository.reload(player);
  };

  it('creates an answer for the current turn', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(1);

    await execute(game, player, choices);

    expect(game.answers).toBeAnArrayOfLength(1);
    expect(game.answers[0]).toBeAnObjectWith({
      player,
      choices,
      question: game.question,
    });

    expect(player.cards).toBeAnArrayOfLength(10);

    expect(publisher.lastEvent).toBeAnObjectWith({
      type: 'PlayerAnswered',
      game: expect.objectWith({ id: game.id }),
      player,
    });
  });

  it('creates an answer with multiple choices', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(2).reverse();
    const question = new Question('question', [new Blank(1), new Blank(2)]);

    game.question = question;
    await gameRepository.save(game);

    await execute(game, player, choices);

    expect(game.answers).toBeAnArrayOfLength(1);
    expect(game.answers[0]).toBeAnObjectWith({
      player,
      choices,
      question,
    });

    expect(player.cards).toBeAnArrayOfLength(9);
  });

  it('enters in question master selection play state when the last player answers', async () => {
    const game = await builder.addPlayers().start().get();

    for (const player of game.playersExcludingQM) {
      await execute(game, player, player.getFirstCards(1));
    }

    expect(game.playState).toEqual(PlayState.questionMasterSelection);

    expect(publisher.lastEvent).toBeAnObjectWith({
      type: 'AllPlayersAnswered',
      game: expect.objectWith({ id: game.id }),
    });
  });

  it('randomizes the answers when the last player answers', async () => {
    const game = await builder.addPlayers().start().get();
    const players = game.playersExcludingQM;

    randomService.randomize = (array) => array.reverse();

    for (const player of players) {
      await execute(game, player, player.getFirstCards(1));
    }

    expect(game.answers.map((answer) => answer.player.id)).toEqual(players.reverse().map((player) => player.id));
  });

  it('does not create an answer when the player is not in a game', async () => {
    const player = new Player('player');
    const choices = [new Choice('choice 1')];

    player.addCards(choices);
    await playerRepository.save(player);

    const error = await expectError(execute(undefined, player, choices), GameNotFoundError);
    expect(error).toBeAnObjectWith({ meta: { query: { playerId: player.id } } });
  });

  it('does not create an answer when the game is not started', async () => {
    const game = await builder.addPlayers().get();
    const player = game.playersExcludingQM[0];
    const choices = [new Choice('choice 1')];

    player.addCards(choices);
    await playerRepository.save(player);

    const error = await expectError(execute(game, player, choices), InvalidGameStateError);
    expect(error).toBeAnObjectWith({ expected: GameState.started, actual: GameState.idle });
  });

  it('does not create an answer when the game is not in play state players answer', async () => {
    for (const playState of [PlayState.questionMasterSelection, PlayState.endOfTurn]) {
      const game = await builder.addPlayers().start().play(playState).get();
      const player = game.playersExcludingQM[0];
      const choices = player.getFirstCards(1);

      const error = await expectError(execute(game, player, choices), InvalidPlayStateError);
      expect(error).toBeAnObjectWith({ expected: PlayState.playersAnswer, actual: playState });
    }
  });

  it('does not create an answer when the player is the question master', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.questionMaster;
    const choices = player.getFirstCards(1);

    const error = await expectError(execute(game, player, choices), PlayerIsQuestionMasterError);
    expect(error).toBeAnObjectWith({ player });
  });

  it('does not create an answer when the player has already answered', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];

    await expect(execute(game, player, player.getFirstCards(1))).not.toBeRejected();
    await playerRepository.reload(player);

    const error = await expectError(execute(game, player, player.getFirstCards(1)), PlayerAlreadyAnsweredError);
    expect(error).toBeAnObjectWith({ player });
  });

  it('does not create an answer with choices that the player does not own', async () => {
    const game = await builder.addPlayers().start().get();
    const question = new Question('question', [new Blank(4), new Blank(8)]);
    const player = game.playersExcludingQM[0];

    const [playerChoice] = player.getFirstCards(1);
    const [otherPlayerChoice] = game.playersExcludingQM[1].getFirstCards(1);
    const choices = [playerChoice, otherPlayerChoice];

    game.question = question;
    await gameRepository.save(game);

    const error = await expectError(execute(game, player, choices), InvalidChoicesSelectionError);
    expect(error).toBeAnObjectWith({ player, choicesIds: [otherPlayerChoice.id] });
  });

  it('does not create an answer with an invalid number of choices', async () => {
    const game = await builder.addPlayers().start().get();
    const player = game.playersExcludingQM[0];
    const choices = player.getFirstCards(2);

    let error = await expectError(execute(game, player, []), InvalidNumberOfChoicesError);
    expect(error).toBeAnObjectWith({ expected: 1, actual: 0 });

    error = await expectError(execute(game, player, choices), InvalidNumberOfChoicesError);
    expect(error).toBeAnObjectWith({ expected: 1, actual: 2 });
  });
});
