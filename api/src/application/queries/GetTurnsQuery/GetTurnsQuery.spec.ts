import { expect } from 'chai';

import { PlayState } from '../../../../../shared/enums';
import { InMemoryGameRepository } from '../../../infrastructure/database/repositories/game/InMemoryGameRepository';
import { StubSessionStore } from '../../../infrastructure/stubs/StubSessionStore';
import { GameBuilder } from '../../../utils/GameBuilder';
import { instanciateHandler } from '../../../utils/injector';
import { instanciateStubDependencies } from '../../../utils/stubDependencies';

import { GetTurnsHandler } from './GetTurnsQuery';

describe('GetTurnsQuery', () => {
  let gameRepository: InMemoryGameRepository;
  let builder: GameBuilder;

  let handler: GetTurnsHandler;

  const session = new StubSessionStore();

  beforeEach(() => {
    const deps = instanciateStubDependencies();
    ({ gameRepository, builder } = deps);

    handler = instanciateHandler(GetTurnsHandler, deps);
  });

  it("fetches a game's turns", async () => {
    const game = await builder.addPlayers().start().play(PlayState.endOfTurn).get();
    const turn = game.currentTurn;

    await gameRepository.addTurn(game.id, turn);

    const turns = await handler.execute({ gameId: game.id }, session);

    expect(turns).to.eql([
      {
        number: 0,
        question: turn.question.toJSON(),
        answers: [turn.answers[0].toJSON(), turn.answers[1].toJSON()],
        winner: turn.winner.nick,
      },
    ]);
  });
});
