import { expect } from 'chai';
import _ from 'lodash';

import { GameState, PlayState } from '../../../../../shared/enums';
import { GameNotFoundError } from '../../../domain/errors/GameNotFoundError';
import { Answer } from '../../../domain/models/Answer';
import { Blank } from '../../../domain/models/Blank';
import { Choice } from '../../../domain/models/Choice';
import { Player } from '../../../domain/models/Player';
import { createQuestion } from '../../../domain/models/Question';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubExternalData } from '../../../infrastructure/stubs/StubExternalData';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GetGameHandler } from './GetGameQuery';

describe('GetGameQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;

  let handler: GetGameHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, externalData } = deps);

    handler = instanciateHandler(GetGameHandler, deps);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  it('throws when the game does not exist', async () => {
    await expect(handler.execute({ gameId: 'nope' })).to.be.rejectedWith(GameNotFoundError);
  });

  it('queries an idle game', async () => {
    const player = new Player('graincheux');
    const game = await builder.addPlayer(player).get();

    const result = await handler.execute({ gameId: game.id });

    expect(result).to.eql({
      id: game.id,
      code: game.code,
      players: [
        {
          id: player.id,
          nick: 'graincheux',
          isConnected: false,
        },
      ],
      gameState: GameState.idle,
    });
  });

  it('queries a finished game', async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();

    game.finish();
    await gameRepository.save(game);

    const result = await handler.execute({ gameId: game.id });

    expect(_.omit(result, 'players')).to.eql({
      id: game.id,
      code: game.code,
      gameState: GameState.finished,
    });
  });

  it('queries a started game in playersAnswer play state', async () => {
    const player = new Player('prof');
    const choices = [new Choice('yeah'), new Choice('!')];
    const question = createQuestion({ text: 'hell  low ?', blanks: [new Blank(5), new Blank(10)] });
    const game = await builder.addPlayers().start().get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    await gameRepository.save(game);

    const result = await handler.execute({ gameId: game.id });

    expect(_.omit(result, 'players')).to.eql({
      id: game.id,
      code: game.code,
      gameState: GameState.started,
      playState: PlayState.playersAnswer,
      questionMaster: game.questionMaster.nick,
      question: {
        text: 'hell  low ?',
        formatted: 'hell __ low __?',
        blanks: [5, 10],
        numberOfBlanks: 2,
      },
      answers: [],
      winner: undefined,
    });
  });

  it('queries a started game in questionMasterSelection play state', async () => {
    const player = new Player('dormeur');
    const choices = [new Choice('Who who')];
    const question = createQuestion({ text: 'Who are you?' });
    const game = await builder.addPlayers().start().play(PlayState.questionMasterSelection).get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    await gameRepository.save(game);

    const result = await handler.execute({ gameId: game.id });

    expect(_.omit(result, 'id', 'code', 'questionMaster', 'players')).to.eql({
      gameState: GameState.started,
      playState: PlayState.questionMasterSelection,
      question: {
        text: 'Who are you?',
        formatted: 'Who are you? __',
        blanks: undefined,
        numberOfBlanks: 1,
      },
      answers: [
        {
          id: game.answers[0].id,
          choices: [
            {
              id: choices[0].id,
              text: 'Who who',
            },
          ],
          formatted: 'Who are you? Who who',
        },
      ],
      winner: undefined,
    });
  });

  it('queries a started game in endOfTurn play state', async () => {
    const player = new Player('joyeux');
    const choices = [new Choice('yeah'), new Choice('!')];
    const question = createQuestion({ text: 'hell  low ?', blanks: [new Blank(5), new Blank(10)] });
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    game.winner = player;
    await gameRepository.save(game);

    const result = await handler.execute({ gameId: game.id });

    expect(_.omit(result, 'id', 'code', 'questionMaster', 'question', 'players')).to.eql({
      gameState: GameState.started,
      playState: PlayState.endOfTurn,
      answers: [
        {
          id: game.answers[0].id,
          choices: choices.map(({ id, text }) => ({ id, text })),
          formatted: 'hell yeah low !?',
          player: 'joyeux',
        },
      ],
      winner: 'joyeux',
    });
  });
});
