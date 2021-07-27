import { expect } from 'chai';

import { PlayState } from '../../../../shared/enums';
import { AllPlayersAnsweredEvent } from '../../domain/events/AllPlayersAnsweredEvent';
import { GameFinishedEvent } from '../../domain/events/GameFinishedEvent';
import { GameJoinedEvent } from '../../domain/events/GameJoinedEvent';
import { GameStartedEvent } from '../../domain/events/GameStartedEvent';
import { PlayerAnsweredEvent } from '../../domain/events/PlayerAnsweredEvent';
import { TurnFinishedEvent } from '../../domain/events/TurnFinishedEvent';
import { TurnStartedEvent } from '../../domain/events/TurnStartedEvent';
import { WinnerSelectedEvent } from '../../domain/events/WinnerSelectedEvent';
import { Answer } from '../../domain/models/Answer';
import { Blank } from '../../domain/models/Blank';
import { Choice } from '../../domain/models/Choice';
import { Game } from '../../domain/models/Game';
import { Player } from '../../domain/models/Player';
import { createQuestion } from '../../domain/models/Question';
import { StubLogger } from '../../infrastructure/stubs/StubLogger';
import { StubNotifier } from '../../infrastructure/stubs/StubNotifier';

import { GameEventsHandler } from './GameEventsHandler';

describe('GameEventsHandler', () => {
  let logger: StubLogger;
  let notifier: StubNotifier;
  let handler: GameEventsHandler;

  beforeEach(() => {
    logger = new StubLogger();
    notifier = new StubNotifier();
    handler = new GameEventsHandler(logger, notifier);
  });

  it('logs the events', () => {
    const game = new Game();
    const player = new Player('player');

    handler.execute(new GameJoinedEvent(game, player));

    expect(logger.last('info')).to.eql(['notify', game.code, 'GameJoined']);
    expect(logger.last('verbose')).to.eql(['notify', { type: 'GameJoined', player: 'player' }]);
  });

  it('GameJoined event', () => {
    const game = new Game();
    const player = new Player('player');

    handler.execute(new GameJoinedEvent(game, player));

    expect(notifier.lastGameMessage(game)).to.eql({ type: 'GameJoined', player: 'player' });
  });

  it('GameStarted event', () => {
    const game = new Game();

    handler.execute(new GameStartedEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'GameStarted',
    });
  });

  it('TurnStarted event', () => {
    const game = new Game();

    game.question = createQuestion({ text: 'question  ?', blanks: [new Blank(9)] });
    game.questionMaster = new Player('question master');

    handler.execute(new TurnStartedEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
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

  it('PlayerAnswered event', () => {
    const game = new Game();
    const player = new Player('player');

    handler.execute(new PlayerAnsweredEvent(game, player));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'PlayerAnswered',
      player: player.nick,
    });
  });

  it('AllPlayersAnswered event', () => {
    const game = new Game();
    const player = new Player('player');
    const answer = new Answer(player, createQuestion({ text: 'Hello !', blanks: [new Blank(6)] }), [new Choice('you')]);

    game.answers = [answer];

    handler.execute(new AllPlayersAnsweredEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'AllPlayersAnswered',
      answers: [
        {
          id: answer.id,
          choices: answer.choices.map(({ id, text }) => ({ id, text })),
          formatted: 'Hello you!',
        },
      ],
    });
  });

  it('WinnerSelectedAnswered event', () => {
    const game = new Game();
    const player = new Player('player');
    const winner = new Player('winner');
    const answer = new Answer(player, createQuestion({ text: 'Who are you?' }), [new Choice('who who')]);

    game.answers = [answer];
    game.winner = winner;

    handler.execute(new WinnerSelectedEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'WinnerSelected',
      winner: 'winner',
      answers: [
        {
          id: answer.id,
          player: 'player',
          choices: answer.choices.map(({ id, text }) => ({ id, text })),
          formatted: 'Who are you? who who',
        },
      ],
    });
  });

  it('TurnFinished event', () => {
    const game = new Game();

    handler.execute(new TurnFinishedEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'TurnFinished',
    });
  });

  it('GameFinished event', () => {
    const game = new Game();

    handler.execute(new GameFinishedEvent(game));

    expect(notifier.lastGameMessage(game)).to.eql({
      type: 'GameFinished',
    });
  });
});
