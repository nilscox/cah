import { expect } from 'earljs';
import { invokeMap } from 'lodash';

import { AllPlayersAnsweredEvent } from '../../../domain/events/AllPlayersAnsweredEvent';
import { GameFinishedEvent } from '../../../domain/events/GameFinishedEvent';
import { GameJoinedEvent } from '../../../domain/events/GameJoinedEvent';
import { GameLeftEvent } from '../../../domain/events/GameLeftEvent';
import { GameStartedEvent } from '../../../domain/events/GameStartedEvent';
import { PlayerAnsweredEvent } from '../../../domain/events/PlayerAnsweredEvent';
import { TurnFinishedEvent } from '../../../domain/events/TurnFinishedEvent';
import { TurnStartedEvent } from '../../../domain/events/TurnStartedEvent';
import { WinnerSelectedEvent } from '../../../domain/events/WinnerSelectedEvent';
import { Answer } from '../../../domain/models/Answer';
import { Blank } from '../../../domain/models/Blank';
import { createChoice } from '../../../domain/models/Choice';
import { createGame } from '../../../domain/models/Game';
import { Player } from '../../../domain/models/Player';
import { createQuestion, createQuestions } from '../../../domain/models/Question';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubLogger } from '../../../infrastructure/stubs/StubLogger';
import { StubNotifier } from '../../../infrastructure/stubs/StubNotifier';
import { StubRTCManager } from '../../../infrastructure/stubs/StubRTCManager';
import { PlayState } from '../../../shared/enums';
import { instanciateHandler } from '../../../utils/dependencyInjection';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GameEventsHandler } from './GameEventsHandler';

describe('GameEventsHandler', () => {
  const logger = new StubLogger();

  let gameRepository: InMemoryGameRepository;
  let notifier: StubNotifier;
  let rtcManager: StubRTCManager;

  let handler: GameEventsHandler;

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, notifier, rtcManager } = deps);

    handler = instanciateHandler(GameEventsHandler, deps, logger);
  });

  it('logs the events', async () => {
    const game = createGame();
    const player = new Player('player');

    await handler.execute(new GameJoinedEvent(game, player));

    expect(logger.last('info')).toEqual(['notify', game.code, { type: 'GameJoined' }]);
    expect(logger.last('debug')).toEqual([
      'notify',
      { type: 'GameJoined', player: { id: player.id, nick: 'player', isConnected: false } },
    ]);
  });

  it('GameJoined event', async () => {
    const game = createGame();
    const player = new Player('player');

    rtcManager.setConnected(player);

    await handler.execute(new GameJoinedEvent(game, player));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'GameJoined',
      player: {
        id: player.id,
        nick: player.nick,
        isConnected: true,
      },
    });
  });

  it('GameLeft event', async () => {
    const game = createGame();
    const player = new Player('player');

    await handler.execute(new GameLeftEvent(game, player));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'GameLeft',
      player: player.nick,
    });
  });

  it('GameStarted event', async () => {
    const game = createGame();

    await gameRepository.addQuestions(game.id, createQuestions(2));

    await handler.execute(new GameStartedEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'GameStarted',
      totalQuestions: 2,
    });
  });

  it('TurnStarted event', async () => {
    const game = createGame();

    game.question = createQuestion({ text: 'question  ?', blanks: [new Blank(9)] });
    game.questionMaster = new Player('question master');

    await handler.execute(new TurnStartedEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'TurnStarted',
      playState: PlayState.playersAnswer,
      questionMaster: 'question master',
      question: {
        text: 'question  ?',
        blanks: [9],
        numberOfBlanks: 1,
        formatted: 'question __ ?',
      },
    });
  });

  it('PlayerAnswered event', async () => {
    const game = createGame();
    const player = new Player('player');

    await handler.execute(new PlayerAnsweredEvent(game, player));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'PlayerAnswered',
      player: player.nick,
    });
  });

  it('AllPlayersAnswered event', async () => {
    const game = createGame();
    const player = new Player('player');
    const answer = new Answer(player, createQuestion({ text: 'Hello !', blanks: [new Blank(6)] }), [
      createChoice('you'),
    ]);

    game.answers = [answer];

    await handler.execute(new AllPlayersAnsweredEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'AllPlayersAnswered',
      answers: [
        {
          id: answer.id,
          choices: invokeMap(answer.choices, 'toJSON'),
          formatted: 'Hello you!',
        },
      ],
    });
  });

  it('WinnerSelectedAnswered event', async () => {
    const game = createGame();
    const player = new Player('player');
    const winner = new Player('winner');
    const answer = new Answer(player, createQuestion({ text: 'Who are you?' }), [createChoice('who who')]);

    game.answers = [answer];
    game.winner = winner;

    await handler.execute(new WinnerSelectedEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'WinnerSelected',
      winner: 'winner',
      answers: [
        {
          id: answer.id,
          player: 'player',
          choices: invokeMap(answer.choices, 'toJSON'),
          formatted: 'Who are you? who who',
        },
      ],
    });
  });

  it('TurnFinished event', async () => {
    const game = createGame();

    await handler.execute(new TurnFinishedEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'TurnFinished',
    });
  });

  it('GameFinished event', async () => {
    const game = createGame();

    await handler.execute(new GameFinishedEvent(game));

    expect(notifier.lastGameMessage(game)).toEqual({
      type: 'GameFinished',
    });
  });
});
