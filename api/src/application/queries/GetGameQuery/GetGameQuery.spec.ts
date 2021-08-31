import { expect } from 'earljs';
import { invokeMap, omit } from 'lodash';

import { GameNotFoundError } from '../../../domain/errors/GameNotFoundError';
import { Answer } from '../../../domain/models/Answer';
import { Blank } from '../../../domain/models/Blank';
import { createChoice } from '../../../domain/models/Choice';
import { createGame } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { createQuestion } from '../../../domain/models/Question';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { InMemoryPlayerRepository } from '../../../infrastructure/database/repositories/player/InMemoryPlayerRepository';
import { StubExternalData } from '../../../infrastructure/stubs/StubExternalData';
import { StubRTCManager } from '../../../infrastructure/stubs/StubRTCManager';
import { GameDto, StartedGameDto } from '../../../shared/dtos';
import { GameState, PlayState } from '../../../shared/enums';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GetGameHandler } from './GetGameQuery';

describe('GetGameQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let playerRepository: InMemoryPlayerRepository;
  let externalData: StubExternalData;
  let rtcManager: StubRTCManager;

  let handler: GetGameHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, playerRepository, externalData, rtcManager } = deps);

    handler = instanciateHandler(GetGameHandler, deps);
  });

  let builder: GameBuilder;

  beforeEach(() => {
    builder = new GameBuilder(gameRepository, playerRepository, externalData);
  });

  const query = <T extends GameDto | StartedGameDto>(gameId: string): Promise<T> => {
    return handler.execute({ gameId }) as Promise<T>;
  };

  it('throws when the game does not exist', async () => {
    await expect(query('nope')).toBeRejected(GameNotFoundError);
  });

  it('queries an idle game', async () => {
    const player = new Player('graincheux');
    const game = await builder
      .from(createGame({ code: '12AB', creator: player }))
      .addPlayer(player)
      .get();

    rtcManager.setConnected(player);

    const result = await query(game.id);

    expect(result).toEqual({
      id: game.id,
      code: '12AB',
      creator: player.id,
      players: [
        {
          id: player.id,
          nick: 'graincheux',
          isConnected: true,
        },
      ],
      gameState: GameState.idle,
    });
  });

  it('queries a finished game', async () => {
    const game = await builder.addPlayers().start().finish().get();

    const result = await query<GameDto>(game.id);

    expect(omit(result, 'creator', 'players')).toEqual({
      id: game.id,
      code: game.code,
      gameState: GameState.finished,
    });
  });

  it('queries a started game in playersAnswer play state', async () => {
    const player = new Player('prof');
    const choices = [createChoice('yeah'), createChoice('!')];
    const question = createQuestion({ text: 'hell  low ?', blanks: [new Blank(5), new Blank(10)] });

    const game = await builder.addPlayers().start(6).get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    await gameRepository.save(game);

    const result = await query<StartedGameDto>(game.id);

    expect(omit(result, 'code', 'creator', 'players')).toEqual({
      id: game.id,
      totalQuestions: 6,
      gameState: GameState.started,
      playState: PlayState.playersAnswer,
      questionMaster: game.questionMaster.id,
      question: {
        id: game.question.id,
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
    const choices = [createChoice('Who who')];
    const question = createQuestion({ text: 'Who are you?' });
    const game = await builder.addPlayers().start(1).play(PlayState.questionMasterSelection).get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    await gameRepository.save(game);

    const result = await query<StartedGameDto>(game.id);

    expect(omit(result, 'id', 'code', 'creator', 'questionMaster', 'players')).toEqual({
      gameState: GameState.started,
      playState: PlayState.questionMasterSelection,
      totalQuestions: 1,
      question: {
        id: question.id,
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
              caseSensitive: false,
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
    const choices = [createChoice('yeah'), createChoice('!')];
    const question = createQuestion({ text: 'hell  low ?', blanks: [new Blank(5), new Blank(10)] });
    const game = await builder.addPlayers().start(1).play(PlayState.endOfTurn).get();

    game.question = question;
    game.answers = [new Answer(player, question, choices)];
    game.winner = player;

    await gameRepository.save(game);

    const result = await query<StartedGameDto>(game.id);

    expect(omit(result, 'id', 'code', 'creator', 'questionMaster', 'question', 'players')).toEqual({
      gameState: GameState.started,
      playState: PlayState.endOfTurn,
      totalQuestions: 1,
      answers: [
        {
          id: game.answers[0].id,
          choices: invokeMap(choices, 'toJSON'),
          formatted: 'hell yeah low !?',
          player: player.id,
        },
      ],
      winner: player.id,
    });
  });
});
